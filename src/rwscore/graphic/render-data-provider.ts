import { RwsStructPool } from "../rws-struct-pool";
import { RwsAtomic, RwsTextureNative } from "../type/rws";
import { vec3, quat, mat4 } from "gl-matrix";

export interface IScene {

}

export interface ITexture {

}

export interface IObject3d {
    name?: string;

    getPosition(): vec3;
    setPosition(v: vec3): void;
    getScaling(): vec3;
    setScaling(v: vec3): void;
    getRotation(): quat;
    setRotation(q: quat): void;

    addChild(...children: IObject3d[]): void;
    removeChild(...children: IObject3d[]): void;
    addToParent(parent: IObject3d): void;
    removeFromParent(): void;

    getParent(): IObject3d | null;
    getChildren(): IObject3d[];
}

export interface IGeometry {

}

export interface IMaterial {
    texture: ITexture | null;
}

export interface IMesh extends IObject3d {
    geometry: IGeometry;
    material: IMaterial;
}

export interface ICamera extends IObject3d {

}

export interface IRenderer {

}

export interface IMeshProvider {
    rwsPool: RwsStructPool;
    getMesh(name: string): Promise<IMesh>;
    //atomicToMesh(atomic: RwsAtomic): IMesh;
    //textureNativeToTexture(texture: RwsTextureNative): ITexture;
}
