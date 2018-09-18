import { ThreeTexture } from "./texture";
import { ThreeVec2 } from "./vec2";
import { IHudElement } from "@rws/platform/graphic/hud-element";
import { Mesh, MeshBasicMaterial, Color } from "three";
import { PlaneGeometry } from "three";

export class ThreeHudElement implements IHudElement {
    src: Mesh;

    texture: ThreeTexture;
    position: ThreeVec2;
    rotation: number;
    scale: ThreeVec2;
    name?: string;
    width: number;
    height: number;
    offset: ThreeVec2;

    constructor(texture: ThreeTexture, position: ThreeVec2, rotation: number = 0, scale: ThreeVec2 = ThreeVec2.one()){
        this.texture = texture;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.width = this.texture.width;
        this.height = this.texture.height;

        const material = new MeshBasicMaterial({
            color: new Color(1, 0, 1),
            map: this.texture.src
        });

        const plane = new PlaneGeometry(this.width, this.height);

        this.src = new Mesh(
            plane,
            material
        );
        this.src.userData.adapter = this;
    }

    setSub(x: number, y: number, width: number, height: number): void {
        this.offset.set(x, y);
        this.width = width;
        this.height = height;
    }
}
