export class Shader {
    vertex: WebGLShader;
    fragment: WebGLShader;
    program: WebGLProgram;
    uniforms: { [key: string]: WebGLUniformLocation; } = {};
    attributes: { [key: string]: number; } = {};

    constructor(
        private gl: WebGL2RenderingContext,
        private vertexSrc: string,
        private fragmentSrc: string,
        private uniformDescriptors?: string[],
        private attributeDescriptors?: string[]
    ) {
        this.createProgram();
        this.bind();
        this.getLocations();
    }

    createShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if(!shader){
            throw new Error('Cannot create shader');
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            const err = `Error compiling shader:\n${this.gl.getShaderInfoLog(shader)}`;
            this.gl.deleteShader(shader);
            throw new Error(err);
        }
        return shader;
    }

    createProgram(): WebGLProgram {
        this.vertex = this.createShader(this.vertexSrc, this.gl.VERTEX_SHADER);
        this.fragment = this.createShader(this.fragmentSrc, this.gl.FRAGMENT_SHADER);

        const program = this.gl.createProgram();
        if(!program){
            throw new Error('Cannot create program');
        }

        this.program = program;

        this.gl.attachShader(program, this.vertex);
        this.gl.attachShader(program, this.fragment);
        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
            const err = `Error linking program:\n${this.gl.getProgramInfoLog(program)}`;
            this.gl.deleteProgram(program);
            throw new Error(err);
        }
        return program;
    }

    getLocations(): void {
        if(this.uniformDescriptors){
            this.uniformDescriptors.forEach(descriptor => {
                const location = this.gl.getUniformLocation(this.program, descriptor);
                if(location === null){
                    throw new Error(`Cannot find uniform position "${descriptor}"`);
                }
                this.uniforms[descriptor] = location;
            });
        }
        if(this.attributeDescriptors){
            this.attributeDescriptors.forEach(descriptor => {
                const location = this.gl.getAttribLocation(this.program, descriptor)
                if(location === -1){
                    throw new Error(`Cannot find attribute position "${descriptor}"`);
                }
                this.attributes[descriptor] = location;
            });
        }
    }

    bind(){
        this.gl.useProgram(this.program);
    }
}
