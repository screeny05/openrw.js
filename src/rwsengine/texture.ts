import { GLES2Context } from '@glaced/gles2-2.0';

export default class Texture {
    gl: GLES2Context;

    name: string;
    format: number;

    glTexture: number;

    constructor(gl: GLES2Context){
        this.gl = gl;

        const texture = this.gl.genTextures(1)[0];

        if(!texture){
            throw new Error('Texture: couldn\'t create texture');
        }

        this.glTexture = texture;
    }
}
