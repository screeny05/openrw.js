import Texture from '../texture';

export default class Material {
    texture: Texture;

    color: Uint8Array[4];
    ambient: number = 1;
    diffuse: number = 1;
    specular: number = 1;

    constructor(){}
}
