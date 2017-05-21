export default class Texture {
    gl: WebGLRenderingContext;

    name: string;
    format: number;

    glTexture: WebGLTexture;

    constructor(gl: WebGLRenderingContext){
        this.gl = gl;

        const texture = this.gl.createTexture();

        if(!texture){
            throw new Error('Texture: couldn\'t create texture');
        }

        this.glTexture = texture;
    }
}
