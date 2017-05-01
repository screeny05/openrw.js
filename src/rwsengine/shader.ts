import * as glslify from 'glslify';

export default class Shader {
    gl: WebGLRenderingContext;

    vertexSrc: string;
    fragmentSrc: string

    locations: any;
    pointers: any = {};

    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;

    program: WebGLProgram;

    constructor(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string, locations: object){
        this.gl = gl;
        this.vertexSrc = glslify(vertexSrc);
        this.fragmentSrc = glslify(fragmentSrc);

        this.locations = locations;
        this.createProgram();
    }

    compileShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) || !shader){
            throw new Error(`Error compiling ${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader source.\n${this.gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    getLocations(){
        Object.keys(this.locations).forEach(key => {
            const locationType: string = this.locations[key];
            let location;

            if(locationType === 'attribute'){
                location = this.gl.getAttribLocation(this.program, key);
            } else if(locationType === 'uniform'){
                location = this.gl.getUniformLocation(this.program, key);
            } else {
                throw new TypeError(`Unknown type ${locationType}`);
            }

            this.pointers[key] = location;
        });
    }

    createProgram(){
        this.vertexShader = this.compileShader(this.vertexSrc, this.gl.VERTEX_SHADER);
        this.fragmentShader = this.compileShader(this.fragmentSrc, this.gl.FRAGMENT_SHADER);

        const program = this.gl.createProgram();
        if(!program){
            throw new Error('Shader: Unknown Error, cannot create WebGLProgram.');
        }

        this.program = program;

        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            throw new Error(`Error compiling shader-program.\n${this.gl.getProgramInfoLog(this.program)}`);
        }

        this.getLocations();
    }
}
