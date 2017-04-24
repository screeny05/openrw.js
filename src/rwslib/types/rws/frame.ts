import { mat3, vec3 } from 'gl-matrix';

interface RWSFrame {
    rotation: mat3;
    position: vec3;
    parentFrameId: number;
}

export default RWSFrame;
