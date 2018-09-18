export interface IVec2 {
    x: number;
    y: number;

    clone(): IVec2;
    set(x: number, y: number): this;
}

export interface IVec2Constructor {
    new(x: number, y: number);
}
