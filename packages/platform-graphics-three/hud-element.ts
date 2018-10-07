import { ThreeTexture } from "./texture";
import { ThreeVec2 } from "./vec2";
import { IHudElement } from "@rws/platform/graphic/hud-element";
import { Mesh, MeshBasicMaterial, Color, BackSide } from "three";
import { PlaneBufferGeometry } from "three";
import { ThreeObject3d } from "./object3d";

export class ThreeHudElement extends ThreeObject3d implements IHudElement {
    geometry: PlaneBufferGeometry;
    material: MeshBasicMaterial;

    private _width: number;
    private _height: number;

    texture: ThreeTexture;
    get width(): number { return this._width; };
    get height(): number { return this._height; };
    offset: ThreeVec2;

    constructor(texture: ThreeTexture){
        const map = texture.src.clone();
        map.needsUpdate = true;

        const material = new MeshBasicMaterial({
            map,
            side: BackSide,
            transparent: texture.hasAlpha
        });

        const geometry = new PlaneBufferGeometry(1, 1);

        // draw textures right side up
        geometry.rotateX(Math.PI);

        super(new Mesh(geometry, material));

        this.geometry = geometry;
        this.material = material;

        this.texture = texture;
        this._width = this.texture.width;
        this._height = this.texture.height;

        this.src.scale.set(this.width, this.height, 1);
    }

    setPosition(x: number, y: number): void {
        this.src.position.set(x + this.width / 2, y + this.height / 2, 0);
    }

    setSize(width: number, height: number): void {
        this.src.scale.set(width, height, 1);
        this._width = width;
        this._height = height;
    }

    setRotation(angle: number): void {
        this.src.rotateZ(angle);
    }

    setTextureOffset(x: number, y: number): void {
        this.material.map.offset.set(x / this.texture.width, y / this.texture.height);
    }

    setTextureSize(width: number, height: number): void {
        this.material.map.repeat.set(width, height);
    }
}
