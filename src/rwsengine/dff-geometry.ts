import Geometry from './geometry';
import Face3 from './face3';

import RWSFrame from '../rwslib/types/rws/frame';
import RWSAtomic from '../rwslib/types/rws/atomic';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';

import * as Corrode from 'corrode';

import { flatten } from 'lodash';
import { vec3, mat4, quat } from 'gl-matrix';

import * as fs from 'fs';
import * as path from 'path';

const config = require('../../config.json');

export default class DffGeometry extends Geometry {
    frameIndex: number;
    geometryIndex: number;

    parentFrameIndex: number;

    constructor(gl: WebGLRenderingContext){
        super(gl);
    }

    static loadFromIpl(gl: WebGLRenderingContext, inst: IplEntryInst, rwsClump: any, name: string){
        const geometry = new DffGeometry(gl);

        const frames: Array<DffGeometry> = [];

        rwsClump.frameList.frames.forEach((rwsFrame, i) => frames.push(DffGeometry.loadFromRwsFrame(gl, rwsClump, rwsFrame, i)));
        DffGeometry.setChildRelations(rwsClump, frames);
        const rootGeometries = DffGeometry.getRootGeometries(frames);

        geometry.addChildren(rootGeometries);

        geometry.position = inst.position;
        geometry.rotation = inst.rotation;
        geometry.scaling = inst.scale;
        geometry.name = name;
        geometry.updateTransform();

        geometry.debug();

        return geometry;
    }

    static loadFromDff(gl: WebGLRenderingContext, dffPath: string, callback: Function){
        const parser = new Corrode();
        const filePath = path.join(config.paths.base, dffPath);
        const fileStream = fs.createReadStream(filePath);

        parser.ext.rws('rws').map.push('rws');

        fileStream.pipe(parser);

        parser.on('finish', function(){
            const frames: Array<DffGeometry> = [];

            parser.vars.forEach(rwsClump => {
                const rwsClumpFrames: Array<DffGeometry> = [];
                rwsClump.frameList.frames.forEach((rwsFrame, i) => rwsClumpFrames.push(DffGeometry.loadFromRwsFrame(gl, rwsClump, rwsFrame, i)));
                DffGeometry.setChildRelations(rwsClump, rwsClumpFrames);
                frames.push(...rwsClumpFrames);
            });
            callback(frames);
        });
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

            geometry.vertices = vertices;

            triangles.forEach(triangle => {
                const a = geometry.vertices[triangle.vertex1];
                const b = geometry.vertices[triangle.vertex2];
                const c = geometry.vertices[triangle.vertex3];

                const faceNormal = vec3.create();
                const productBA = vec3.create();
                const productCA = vec3.create();

                vec3.subtract(productBA, b, a);
                vec3.subtract(productCA, c, a);
                vec3.cross(faceNormal, productBA, productCA);
                vec3.normalize(faceNormal, faceNormal);


                const face = new Face3(triangle.vertex1, triangle.vertex2, triangle.vertex3, faceNormal);

                if(rwsGeometry.flags.prelit){
                    face.aColor = rwsGeometry.colors[triangle.vertex1];
                    face.bColor = rwsGeometry.colors[triangle.vertex2];
                    face.cColor = rwsGeometry.colors[triangle.vertex3];
                }

                if(rwsGeometry.flags.hasNormals){
                    face.aNormal = normals[triangle.vertex1];
                    face.bNormal = normals[triangle.vertex2];
                    face.cNormal = normals[triangle.vertex3];
                }

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
