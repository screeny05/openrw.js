import { Vector2 } from "three";
import { IVec2 } from "@rws/platform/graphic/vec2";

export class ThreeVec2 implements IVec2 {
    src: Vector2;

    static identity(){
        return new ThreeVec2(0, 0);
    }

    static one(){
        return new ThreeVec2(1, 1);
    }

    get x(): number {
        return this.src.x;
    }

    set x(val: number){
        this.src.x = val;
    }

    get y(): number {
        return this.src.y;
    }

    set y(val: number){
        this.src.y = val;
    }

    constructor(x: number, y: number){
        this.src = new Vector2(x, y);
    }

    clone(): ThreeVec2 {
        return new ThreeVec2(this.x, this.y);
    }

    set(x: number, y: number): this {
        this.src.set(x, y);
        return this;
    }
}
