export interface IVec3 {
    x: number;
    y: number;
    z: number;

    clone(): IVec3;
    set(x: number, y: number, z: number): this;
    add(a: IVec3): this;
    sub(a: IVec3): this;
    mul(a: IVec3): this;
    scale(a: number): this;
    cross(a: IVec3): this;
    len(): number;
    lenSqr(): number;
    lerp(a: IVec3, t: number): this;
}

export interface IVec3Constructor {
    new(x: number, y: number, z: number);
    new(IVec3);
}
