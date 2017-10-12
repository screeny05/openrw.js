import * as glslify from 'glslify';

export interface ShaderLocations {
    [name: string]: string;
}

export default class Shader {
    gl: GLESRenderingContext;

    vertexSrc: string;
    fragmentSrc: string

    locations: ShaderLocations;
    pointers: any = {};

    vertexShader: GLESShader;
    fragmentShader: GLESShader;

    program: GLESProgram;

    constructor(gl: GLESRenderingContext, vertexSrc: string, fragmentSrc: string, locations: ShaderLocations){
        this.gl = gl;
        this.vertexSrc = glslify(vertexSrc);
        this.fragmentSrc = glslify(fragmentSrc);

        this.locations = locations;
        this.createProgram();
    }

    compileShader(source: string, type: number): GLESShader {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if(!shader || !this.gl.getShaderiv(shader, this.gl.COMPILE_STATUS)){
            throw new Error(`Shader: Error compiling ${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader source.\n${this.gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    getLocations(){
        Object.keys(this.locations).forEach(key => {
            let locationType: string = this.locations[key];


            let location;

            if(locationType === 'attribute'){
                location = this.gl.getAttribLocation(this.program, key);
                this.gl.enableVertexAttribArray(location);
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
            throw new Error('Shader: Unknown Error, cannot create GLESProgram.');
        }

        this.program = program;

        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if(!this.gl.getProgramiv(this.program, this.gl.LINK_STATUS)){
            throw new Error(`Shader: Error compiling shader-program.\n${this.gl.getProgramInfoLog(this.program)}`);
        }

        this.getLocations();
    }
}
