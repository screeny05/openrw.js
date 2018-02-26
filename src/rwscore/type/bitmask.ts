export type Bitmask<T> = {
    [P in keyof T]: boolean;
};
