import { IVec2 } from "@rws/platform/graphic/vec2";
import { vec2 } from 'gl-matrix';

export class Vec2 implements IVec2 {
    src: vec2;

    static identity(){
        return new Vec2(0, 0);
    }

    static one(){
        return new Vec2(1, 1);
    }

    get x(): number {
        return this.src[0];
    }

    set x(val: number){
        this.src[0] = val;
    }

    get y(): number {
        return this.src[1];
    }

    set y(val: number){
        this.src[1] = val;
    }

    constructor(x: number, y: number){
        this.src = vec2.create();
        this.set(x, y);
    }

    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    set(x: number, y: number): this {
        vec2.set(this.src, x, y);
        return this;
    }
}
