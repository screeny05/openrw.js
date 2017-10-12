export default class Texture {
    gl: GLESRenderingContext;

    name: string;
    format: number;

    glTexture: GLESTexture;

    constructor(gl: GLESRenderingContext){
        this.gl = gl;

        const texture = this.gl.createTexture();

        if(!texture){
            throw new Error('Texture: couldn\'t create texture');
        }

        this.glTexture = texture;
    }
}
