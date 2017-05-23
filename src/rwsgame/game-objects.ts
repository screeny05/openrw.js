import GameData from './game-data';

import Geometry from '../rwsengine/geometry';
import Texture from '../rwsengine/texture';
import Material from '../rwsengine/materials/material';
import Mesh from '../rwsengine/mesh';
import Sphere from '../rwsengine/sphere';
import Face3 from '../rwsengine/face3';

import { IdeEntryObjs } from '../rwslib/loaders/ide';
import { IplEntryInst } from '../rwslib/loaders/ipl';
import * as RWSSectionTypes from '../rwslib/parsers/rws/section-types';
import { RWSClump, RWSFrame, RWSGeometry, RWSTextureFilterMode, RWSTextureAddressMode } from '../rwslib/types/rws/clump';
import { RWSAtomic } from '../rwslib/types/rws/atomic';
import { RWSTextureDictionary, RWSTextureNative, RWSTextureNativeCompression } from '../rwslib/types/rws/texture-dictionary';

import { quat } from 'gl-matrix';
import * as webglew from 'webglew';

export default class GameObjects {
    data: GameData;
    gl: WebGLRenderingContext;

    mapMagFilterMode = {};
    mapMinFilterMode = {};
    mapWrapMode = {};
    mapCompressionMode = {};

    fallbackTexture: Float32Array = new Float32Array([
        0, 1, 0, 1,  1, 0, 1, 1,
        1, 0, 1, 1,  0, 1, 0, 1,
    ]);

    clumpPool: Map<string, RWSClump> = new Map();
    textureDictionaryPool: Map<string, RWSTextureDictionary> = new Map();

    constructor(data: GameData, gl: WebGLRenderingContext){
        this.data = data;
        this.gl = gl;

        this.buildMappingLists();
    }

    buildMappingLists(){
        // filtermodes
        // TODO: mip mapping
        this.mapMinFilterMode[RWSTextureFilterMode.NONE] = this.gl.LINEAR;
        this.mapMinFilterMode[RWSTextureFilterMode.NEAREST] = this.gl.NEAREST;
        this.mapMinFilterMode[RWSTextureFilterMode.LINEAR] = this.gl.LINEAR;
        this.mapMinFilterMode[RWSTextureFilterMode.MIP_NEAREST] = this.gl.NEAREST;
        this.mapMinFilterMode[RWSTextureFilterMode.MIP_LINEAR] = this.gl.LINEAR;
        this.mapMinFilterMode[RWSTextureFilterMode.LINEAR_MIP_NEAREST] = this.gl.NEAREST;
        this.mapMinFilterMode[RWSTextureFilterMode.LINEAR_MIP_LINEAR] = this.gl.LINEAR;

        this.mapMagFilterMode[RWSTextureFilterMode.NONE] = this.gl.LINEAR;
        this.mapMagFilterMode[RWSTextureFilterMode.NEAREST] = this.gl.NEAREST;
        this.mapMagFilterMode[RWSTextureFilterMode.LINEAR] = this.gl.LINEAR;
        this.mapMagFilterMode[RWSTextureFilterMode.MIP_NEAREST] = this.gl.NEAREST;
        this.mapMagFilterMode[RWSTextureFilterMode.MIP_LINEAR] = this.gl.LINEAR;
        this.mapMagFilterMode[RWSTextureFilterMode.LINEAR_MIP_NEAREST] = this.gl.NEAREST;
        this.mapMagFilterMode[RWSTextureFilterMode.LINEAR_MIP_LINEAR] = this.gl.LINEAR;

        // wrapmodes
        this.mapWrapMode[RWSTextureAddressMode.NONE] = this.gl.CLAMP_TO_EDGE;
        this.mapWrapMode[RWSTextureAddressMode.REPEAT] = this.gl.REPEAT;
        this.mapWrapMode[RWSTextureAddressMode.MIRROR] = this.gl.MIRRORED_REPEAT;
        this.mapWrapMode[RWSTextureAddressMode.CLAMP] = this.gl.CLAMP_TO_EDGE;
        this.mapWrapMode[RWSTextureAddressMode.BORDER] = this.gl.CLAMP_TO_EDGE;

        // compression modes
        // TODO for node-webgl
        /*const ext = this.gl.getExtension(webglew(this.gl).texture_compression_s3tc);
        if(!ext){
            throw new Error(`GameObjects: extension compressed_texture_s3tc not supported`);
        }
        console.log(ext, this.gl.getExtension(ext));
        this.mapCompressionMode[RWSTextureNativeCompression.DXT1] = ext.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        this.mapCompressionMode[RWSTextureNativeCompression.DXT3] = ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;*/
    }

    async loadResourceFromPool(name: string, pool: Map<string, any>, expectedRwsSectionType: number, fromImg: boolean = true): Promise<any> {
        let resource = pool.get(name);
        if(resource){
            return resource;
        }

        if(fromImg){
            resource = (await this.data.loadRWSFromImg('models/gta3.img', name, expectedRwsSectionType, 1))[0];
        } else {
            resource = (await this.data.loadRWSFromFile(name, expectedRwsSectionType, 1))[0];
        }


        if(!resource){
            throw new Error(`GameObjects: couldn't load resource ${name}.`);
        }

        pool.set(name, resource);
        return resource;
    }

    async loadRwsTextureDictionary(name, fromImg: boolean = true): Promise<RWSTextureDictionary> {
        return await this.loadResourceFromPool(name, this.textureDictionaryPool, RWSSectionTypes.RW_TEXTURE_DICTIONARY, fromImg);
    }

    async loadRwsClump(name, fromImg: boolean = true): Promise<RWSClump> {
        return await this.loadResourceFromPool(name, this.textureDictionaryPool, RWSSectionTypes.RW_CLUMP, fromImg);
    }



    async loadMesh(definition: IdeEntryObjs, placement: IplEntryInst): Promise<Mesh> {
        if(definition.modelName !== placement.modelName){
            console.warn(`GameObject: OBJS and INST differ in modelName. Using INST.\nOBJS: ${definition.modelName}\nINST: ${placement.modelName}`);
        }

        const modelName = placement.modelName || definition.modelName;

        const rwsClump: RWSClump = await this.loadRwsClump(`${modelName}.dff`);
        const rwsTxd: RWSTextureDictionary = await this.loadRwsTextureDictionary(`${definition.txdName}.txd`);

        // not defined by gta, we need it to apply ipl transforms
        const placementMesh = new Mesh(definition.modelName);

        const rwsMeshes: Array<Mesh> = rwsClump.frameList.frames.map((rwsFrame, i) => this.loadMeshFromRwsFrame(rwsClump, rwsFrame, i, rwsTxd));

        this.setMeshChildRelations(rwsClump, rwsMeshes);

        const rwsRootMesh = this.getRootMesh(rwsMeshes);

        if(!rwsRootMesh){
            throw new ReferenceError(`GameObject: couldn't find rootMesh in ${modelName}`);
        }

        placementMesh.addChild(rwsRootMesh);

        placementMesh.position = placement.position;
        placementMesh.rotation = placement.rotation;
        placementMesh.scaling = placement.scale;
        placementMesh.updateTransform();

        return placementMesh;
    }

    loadMeshFromRwsFrame(rwsClump: RWSClump, rwsFrame: RWSFrame, frameIndex: number, rwsTxd: RWSTextureDictionary): Mesh {
        const rwsFrameExtension = rwsClump.frameList.extensions[frameIndex].sections.find(section => section.__name__ === 'rwsFrame');
        const rwsAtomic: RWSAtomic|undefined = rwsClump.atomics.find(atomic => atomic.frameIndex === frameIndex);

        const geometry = new Geometry(this.gl);
        const mesh = new Mesh(rwsFrameExtension.name);

        mesh.position = rwsFrame.position;
        quat.fromMat3(mesh.rotation, rwsFrame.rotation);


        // rwsAtomic contains our geometry data
        // there's nothing more if we don't have a geometry
        if(!rwsAtomic){
            return mesh;
        }

        const rwsGeometry = rwsAtomic.geometry;
        const rwsMorphTarget = rwsGeometry.morphTargets[0];

        const { vertices, normals } = rwsMorphTarget;

        const materials = this.loadMaterialsFromRwsGeometry(rwsGeometry, rwsTxd);

        geometry.boundingSphere = new Sphere(rwsMorphTarget.spherePosition, rwsMorphTarget.sphereRadius);
        geometry.uvCoordinates = rwsGeometry.textureCoordinates;

        if(rwsMorphTarget.vertices){ geometry.vertices = rwsMorphTarget.vertices; }
        if(rwsMorphTarget.normals){ geometry.vertexNormals = rwsMorphTarget.normals; }
        if(rwsGeometry.colors){ geometry.vertexColors = rwsGeometry.colors; }

        geometry.faces = rwsGeometry.triangles.map(triangle =>
            new Face3(triangle.vertex1, triangle.vertex2, triangle.vertex3, triangle.materialId)
        );

        geometry.updateBuffer();
        mesh.geometry = geometry;
        mesh.materials = materials;

        return mesh;
    }

    loadMaterialsFromRwsGeometry(rwsGeometry: RWSGeometry, rwsTxd: RWSTextureDictionary): Array<Material> {
        const materials: Array<Material> = rwsGeometry.materialList.materials.map((rwsMaterial, i) => {
            const material = new Material();

            if(rwsMaterial.isTextured){
                const rwsTextureNative = rwsTxd.textures.find(rwsTextureNative => rwsTextureNative.name === rwsMaterial.texture.name);

                if(!rwsTextureNative){
                    console.warn(`GameObject: cannot find rwsTextureNative '${rwsMaterial.texture.name}' in given txd.`);
                }

                const texture: Texture = this.loadTextureFromRwsTexture(rwsTextureNative);

//if(rwsTextureNative)debugPPM(i + '__' + rwsTextureNative.name, rwsTextureNative.width, rwsTextureNative.height, rwsTextureNative.mipLevels[0]);

                material.texture = texture;
            }

            if(rwsMaterial.ambient){ material.ambient = rwsMaterial.ambient; }
            if(rwsMaterial.specular){ material.specular = rwsMaterial.specular; }
            if(rwsMaterial.diffuse){ material.diffuse = rwsMaterial.diffuse; }

            if(rwsGeometry.surfaceAmbient){ material.ambient = rwsGeometry.surfaceAmbient; }
            if(rwsGeometry.surfaceSpecular){ material.specular = rwsGeometry.surfaceSpecular; }
            if(rwsGeometry.surfaceDiffuse){ material.diffuse = rwsGeometry.surfaceDiffuse; }

            material.color = new Float32Array([rwsMaterial.color[0] / 255, rwsMaterial.color[1] / 255, rwsMaterial.color[2] / 255, rwsMaterial.color[3] / 255]);

            return material;
        });

        return materials;
    }

    loadTextureFromRwsTexture(rwsTextureNative: RWSTextureNative|undefined): Texture {
        const texture = new Texture(this.gl);

        if(!rwsTextureNative){
            this.bindErrorTexture(texture.glTexture);
            return texture;
        }

        let currentWidth = rwsTextureNative.width;
        let currentHeight = rwsTextureNative.height;

        texture.name = rwsTextureNative.name;

        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glTexture);

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.mapMagFilterMode[rwsTextureNative.filterMode]);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.mapMinFilterMode[rwsTextureNative.filterMode]);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.mapWrapMode[rwsTextureNative.uAddressing]);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.mapWrapMode[rwsTextureNative.vAddressing]);

        const isFullColor = rwsTextureNative.flags.FORMAT_1555 || rwsTextureNative.flags.FORMAT_8888 || rwsTextureNative.flags.FORMAT_888;
        const isTransparent = !rwsTextureNative.flags.FORMAT_888;

        if(!rwsTextureNative.flags.PALETTE_8 && !isFullColor){
            console.error(`Unsupported raster format ${JSON.stringify(rwsTextureNative.flags)}`);
            this.bindErrorTexture(texture.glTexture);
            return texture;
        }

        let type = this.gl.UNSIGNED_BYTE;
        let format = this.gl.RGBA;

        if(rwsTextureNative.flags.PALETTE_8){
            // default

        } else if(isFullColor) {

            if(rwsTextureNative.flags.FORMAT_1555){
                type = 0x8366;
            } else if(rwsTextureNative.flags.FORMAT_8888){
                format = 0x80E1;
            } else if(rwsTextureNative.flags.FORMAT_888){
                format = 0x80E1;
            }
        } else {
            console.error(`Unsupported raster format ${JSON.stringify(rwsTextureNative.flags)}`);
            this.bindErrorTexture(texture.glTexture);
            return texture;
        }

        rwsTextureNative.mipLevels.forEach((mipLevel, i) => {
            this.gl.texImage2D(this.gl.TEXTURE_2D, i, format, currentWidth, currentHeight, 0, format, type, mipLevel);

            currentWidth /= 2;
            currentHeight /= 2;
        });

        this.gl.generateMipmap(this.gl.TEXTURE_2D);





        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        return texture;
    }

    getRootMesh(meshes: Array<Mesh>): Mesh|undefined {
        return meshes.find(mesh => !mesh.parent);
    }

    setMeshChildRelations(rwsClump: RWSClump, meshes: Array<Mesh>){
        const frames: Array<RWSFrame> = rwsClump.frameList.frames;

        frames.forEach((frame, i) => {
            if(frame.parentFrameId >= 0){
                meshes[i].addToParent(meshes[frame.parentFrameId]);
            }
        });
    }

    bindErrorTexture(glTexture: WebGLTexture){
        this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 2, 2, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.fallbackTexture);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}














const debugPPM = (name, width, height, rgbaBuffer) => {
    let ppm = `P3\n${width} ${height}\n255\n`;

    for (var i = 0; i < rgbaBuffer.length / 4; i++) {
        let r = rgbaBuffer[i * 4 + 0];
        let g = rgbaBuffer[i * 4 + 1];
        let b = rgbaBuffer[i * 4 + 2];
        const a = rgbaBuffer[i * 4 + 3] / 255;

        r = r + ((1 - a) * 255);
        b = b + ((1 - a) * 255);

        if(a === 0){
            r = 255;
            g = 0;
            b = 255;
        }

        ppm += r + ' ' + g + ' ' + b + '\n';
    }

    require('fs').writeFileSync(`debug/txd_${name}-${width}.ppm`, ppm, 'utf8');
};
