import Texture from './texture';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

import * as Corrode from 'corrode';

import { vec3, mat4, quat } from 'gl-matrix';

import * as fs from 'fs';
import * as path from 'path';

interface MipLevel {
    width: number;
    height: number;
}

export default class TxdTexture extends Texture {
    name: string;
    format: number;

    glTexture: WebGLTexture;

    mipLevels: Array<MipLevel> = [];

    constructor(gl: WebGLRenderingContext){
        super(gl);

        const texture = gl.createTexture();

        if(!texture){
            throw new Error('Texture: couldn\'t create texture');
        }

        this.glTexture = texture;
    }

    static loadFromRwsTxd(gl: WebGLRenderingContext, rwsTxd: any, name: string): Array<TxdTexture> {
        const textures: Array<TxdTexture> = [];

        rwsTxd.textures.forEach(textureNative => {
            const texture = new TxdTexture(gl);

            let currentWidth = textureNative.width;
            let currentHeight = textureNative.height;

            texture.name = textureNative.name;

            gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            textureNative.mipLevels.forEach((mipLevel, i) => {
                gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, currentWidth, currentHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, mipLevel);

                currentWidth /= 2;
                currentHeight /= 2;
            });

            gl.bindTexture(gl.TEXTURE_2D, null);

            textures.push(texture);
        });

        return textures;
    }

    static createWebGLTexture(gl: WebGLRenderingContext, data, format): WebGLTexture {
        const texture = gl.createTexture();

        if(!texture){
            throw new Error('couldn\'t create texture');
        }

        return texture;
    }
}
