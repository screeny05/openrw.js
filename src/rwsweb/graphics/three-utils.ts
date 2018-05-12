import { vec3, quat, vec2 } from "gl-matrix";
import { Vector3, Euler, Quaternion, Vector2 } from "three";

export const threeVectorToGlVec3 = (v: Vector3): vec3 => vec3.fromValues(v.x, v.y, v.z);

export const setThreeVectorFromGlVec3 = (from: vec3, to: Vector3): void => {
    to.set(from[0], from[1], from[2]);
}

export const glVec2ToThreeVector = (from: vec2): Vector2 => {
    return new Vector2(from[0], from[1]);
}

export const threeEulerToGlQuat = (e: Euler): quat => {
    const q = quat.create();
    quat.fromEuler(q, e.x, e.y, e.z);
    return q;
}

export const glQuatToThreeQuaternion = (q: quat): Quaternion => new Quaternion(q[0], q[1], q[2], q[3]);

export const setThreeEulerFromGlQuat = (from: quat, to: Euler): void => {
    const quat = glQuatToThreeQuaternion(from);
    to.setFromQuaternion(quat);
}
