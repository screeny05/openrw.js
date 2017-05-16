import Geometry from './geometry';
import Face3 from './face3';

import TxdTexture from './txd-texture';

import RWSFrame from '../rwslib/types/rws/frame';
import RWSAtomic from '../rwslib/types/rws/atomic';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

import * as Corrode from 'corrode';

import { flatten } from 'lodash';
import { vec3, mat4, quat } from 'gl-matrix';

import * as fs from 'fs';
import * as path from 'path';

export default class DffGeometry extends Geometry {
    frameIndex: number;
    geometryIndex: number;

    parentFrameIndex: number;

    constructor(gl: WebGLRenderingContext){
        super(gl);
    }

    static loadFromIpl(gl: WebGLRenderingContext, inst: IplEntryInst, rwsClump: any, name: string, textures: Array<TxdTexture>){
        const geometry = new DffGeometry(gl);

        const frames: Array<DffGeometry> = [];

        rwsClump.frameList.frames.forEach((rwsFrame, i) => frames.push(DffGeometry.loadFromRwsFrame(gl, rwsClump, rwsFrame, i)));
        DffGeometry.setChildRelations(rwsClump, frames);
        const rootGeometries = DffGeometry.getRootGeometries(frames);

        geometry.addChildren(rootGeometries);

        rootGeometries[0].textures = textures;

        geometry.position = inst.position;
        geometry.rotation = inst.rotation;
        geometry.scaling = inst.scale;
        geometry.name = name;
        geometry.updateTransform();

        geometry.debug();

        return geometry;
    }

    static setChildRelations(rwsClump, dffGeometries: Array<DffGeometry>){
        const frames: Array<RWSFrame> = rwsClump.frameList.frames;

        frames.forEach((frame, i) => {
            if(frame.parentFrameId >= 0){
                dffGeometries[i].addToParent(dffGeometries[frame.parentFrameId]);
            }
        });
    }

    static getRootGeometries(dffGeometries: Array<DffGeometry>): Array<DffGeometry> {
        return dffGeometries.filter(geometry => geometry.parentFrameIndex < 0);
    }

    static loadFromRwsFrame(gl: WebGLRenderingContext, rwsClump, rwsFrame: RWSFrame, frameIndex): DffGeometry {
        const geometry = new DffGeometry(gl);

        geometry.position = rwsFrame.position;
        quat.fromMat3(geometry.rotation, rwsFrame.rotation);

        const rwsAtomic: RWSAtomic|null = rwsClump.atomics.find(atomic => atomic.frameIndex === frameIndex);
        const rwsFrameExtension = rwsClump.frameList.extensions[frameIndex];

        if(rwsAtomic){
            const rwsGeometry = rwsAtomic.geometry;

            const morphTarget = rwsGeometry.morphTargets[0];
            const { vertices, normals } = morphTarget;
            const triangles = rwsGeometry.triangles;

            geometry.uvCoordinates = rwsGeometry.textureCoordinates;

            geometry.vertices = vertices;

            if(rwsGeometry.flags.prelit){
                geometry.vertexColors = rwsGeometry.colors;
            }

            if(rwsGeometry.flags.hasNormals){
                geometry.vertexNormals = normals;
            }

            triangles.forEach(triangle => {
                const face = new Face3(triangle.vertex1, triangle.vertex2, triangle.vertex3, triangle.materialId);

                geometry.faces.push(face);
            });

            geometry.geometryIndex = rwsAtomic.geometryIndex;
        }

        geometry.frameIndex = frameIndex;
        geometry.parentFrameIndex = rwsFrame.parentFrameId;

        const rwsNameExtension = rwsFrameExtension.sections.find(section => section.__name__ === 'rwsFrame');
        if(rwsNameExtension){
            geometry.name = rwsNameExtension.name;
        }

        geometry.updateTransform();
        geometry.updateBuffer();

        return geometry;
    }
}
