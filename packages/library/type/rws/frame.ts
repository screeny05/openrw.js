import { mat3, vec3 } from 'gl-matrix';
import { RwsSection, RwsExtension } from './index';

export interface RwsFrame {
    rotation: mat3;
    position: vec3;
    parentFrameId: number;
    id: number;
}

export interface RwsFrameExtension extends RwsSection {
    __name__: 'rwsFrame';
    name: string;
}

export interface RwsFrameList extends RwsSection {
    extensions: RwsExtension<RwsFrameExtension>[];
    frames: RwsFrame[];
}
