import { vec3, quat } from 'gl-matrix';

export function vec3FromString(x: string, y: string, z: string): vec3 {
    return vec3.fromValues(Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z));
}

export function quatFromString(x: string, y: string, z: string, w: string): quat {
    return quat.fromValues(Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z), Number.parseFloat(w));
}

export function bitmaskFromString<T>(number: string|number, bitmask: object): T {
    if(typeof number === 'string'){
        number = Number.parseInt(number);
    }
    const targetObject = {};
    Object.keys(bitmask).forEach(key => targetObject[key] = (<number>number & bitmask[key]) === bitmask[key]);

    return targetObject as T;
}
