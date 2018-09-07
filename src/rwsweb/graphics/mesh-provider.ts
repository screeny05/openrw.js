import { RwsStructPool } from '../../rwscore/rws-struct-pool';

import * as THREE from 'three';
import { quat } from 'gl-matrix';
import { IMeshProvider } from "../../rwscore/graphic/render-data-provider";
import { ThreeMesh } from "./mesh";
import { RwsSectionType, RwsAtomic, RwsGeometryMaterialList, RwsGeometryTexture, RwsTextureDictionary, RwsTextureAddressMode, RwsTextureFilterMode, RwsMaterial } from "../../rwscore/type/rws";
import { glVec2ToThreeVector } from './three-utils';

export class ThreeMeshProvider implements IMeshProvider {
    rwsPool: RwsStructPool;
    textureCache: Map<string, THREE.Texture> = new Map();

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;
    }

    async getMesh(name: string): Promise<ThreeMesh> {
        await this.rwsPool.loadRwsFromImg('models/gta3.img', name + '.dff', RwsSectionType.RW_CLUMP);
        await this.rwsPool.loadRwsFromImg('models/gta3.img', name + '.txd', RwsSectionType.RW_TEXTURE_DICTIONARY);
        const dff = this.rwsPool.rwsClumpIndex.get('models/gta3.img/' + name + '.dff');
        const txd = this.rwsPool.rwsTextureDictionaryIndex.get('models/gta3.img/' + name + '.txd');
        if(!dff || !txd){
            throw new Error(`Couldn't load DFF ${name}.dff or TXD ${name}.txd`);
        }

        const rootMesh = new THREE.Mesh();
        rootMesh.name = '__root__' + name;

        const threeMeshes = dff.atomics.map(atomic => {
            const mesh = this.atomicToMesh(atomic, dff.frameList.extensions[atomic.frameIndex].sections[0].name);
            const materials = this.atomicToMaterials(atomic, txd);

            // Typings bug - Mesh.prototype.material accepts THREE.Material[]
            mesh.material = materials as any;

            return mesh;
        });

        threeMeshes.forEach((mesh, i) => {
            const parentThree = threeMeshes.find((mesh, j) => dff.atomics[j].frameIndex === dff.atomics[i].frame.parentFrameId);
            if(!parentThree){
                rootMesh.add(mesh);
            } else {
                parentThree.add(mesh);
            }
        });
        return new ThreeMesh(rootMesh);
    }

    atomicToMesh(atomic: RwsAtomic, name: string = ''): THREE.Mesh {
        const geometry = new THREE.Geometry();

        const rwGeometry = atomic.geometry;
        const morphTarget = rwGeometry.morphTargets[0];
        const vertices = morphTarget.vertices;
        const vertexColors = rwGeometry.colors;
        const vertexNormals = morphTarget.normals;
        const faceUVCoordinates = rwGeometry.textureCoordinates[0];
        const faces = rwGeometry.triangles;
        const rotation = atomic.frame.rotation;

        if(vertices){
            vertices.forEach(vertex => {
                geometry.vertices.push(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
            });
        }

        faces.forEach(face => {
            const normals: any[] = [];
            const colors: any[] = [];
            if(vertexNormals){
                const normal1 = vertexNormals[face.vertex1];
                const normal2 = vertexNormals[face.vertex2];
                const normal3 = vertexNormals[face.vertex3];
                normals.push(
                    new THREE.Vector3(normal1[0], normal1[1], normal1[2]),
                    new THREE.Vector3(normal2[0], normal2[1], normal2[2]),
                    new THREE.Vector3(normal3[0], normal3[1], normal3[2]),
                );
            }
            if(vertexColors){
                const color1 = vertexColors[face.vertex1];
                const color2 = vertexColors[face.vertex2];
                const color3 = vertexColors[face.vertex3];
                colors.push(
                    new THREE.Vector3(color1[0], color1[1], color1[2]),
                    new THREE.Vector3(color2[0], color2[1], color2[2]),
                    new THREE.Vector3(color3[0], color3[1], color3[2]),
                );
            }
            geometry.faces.push(new THREE.Face3(face.vertex1, face.vertex2, face.vertex3, normals, colors, face.materialId));
            geometry.faceVertexUvs[0].push([
                glVec2ToThreeVector(faceUVCoordinates[face.vertex1]),
                glVec2ToThreeVector(faceUVCoordinates[face.vertex2]),
                glVec2ToThreeVector(faceUVCoordinates[face.vertex3]),
            ]);
        });
        geometry.uvsNeedUpdate = true;
        geometry.computeFaceNormals();

        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(morphTarget.spherePosition[0], morphTarget.spherePosition[1], morphTarget.spherePosition[2]), morphTarget.sphereRadius);

        const mesh = new THREE.Mesh(geometry);
        mesh.name = name;

        const rotationQ = quat.create();
        quat.fromMat3(rotationQ, atomic.frame.rotation);

        mesh.position.set(atomic.frame.position[0], atomic.frame.position[1], atomic.frame.position[2]);
        mesh.quaternion.set(rotationQ[0], rotationQ[1], rotationQ[2], rotationQ[3]);
        mesh.visible = faces.length > 0;
        return mesh;
    }

    atomicToMaterials(atomic: RwsAtomic, dictionary: RwsTextureDictionary): THREE.Material[] {
        const { materialList } = atomic.geometry;

        let currentIndex = 0;
        const instancedMaterials = materialList.materialIndices.map(index => {
            if(index !== -1){
                return null;
            }
            return this.materialToThreeMaterial(materialList.materials[currentIndex++], dictionary, true);
        });

        const materials = materialList.materialIndices.map((index, i) => {
            const instanceIndex = index === -1 ? i : index;
            const material = instancedMaterials[i];
            if(!material){
                throw new Error(`Material with index ${i} not found.`);
            }
            return material;
        });
        return materials;
    }

    materialToThreeMaterial(material: RwsMaterial, dictionary: RwsTextureDictionary, isPrelit: boolean): THREE.Material {
        const [r, g, b, a] = material.color;
        const color = (r << 16) + (g << 8) + b;

        const threeMaterial = new THREE.MeshLambertMaterial({
            color,
            flatShading: false,
            vertexColors: isPrelit ? THREE.VertexColors : THREE.NoColors,
        });

        if(material.isTextured){
            threeMaterial.map = this.txdToTexture(material.texture, dictionary);
        }

        return threeMaterial;
    }

    txdToTexture(texture: RwsGeometryTexture, dictionary: RwsTextureDictionary): THREE.Texture {
        const textureNative = dictionary.textures.find(texture => texture.name === texture.name);
        if(!textureNative){
            throw new Error(`TextureNative ${texture.name} not found`);
        }

        /*const canvas = document.createElement('canvas');
        canvas.width = textureNative.width;
        canvas.height = textureNative.height;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if(!ctx){
            throw new Error('No context');
        }

        for(let i = 0; i < textureNative.width * textureNative.height; i++){
            const tx = textureNative.mipLevels[0];
            const x = i % textureNative.width;
            const y = Math.floor(i / textureNative.height);
            const ci = i * 4;
            ctx.fillStyle = `rgba(${tx[ci]}, ${tx[ci + 1]}, ${tx[ci + 2]}, ${tx[ci + 3] / 255})`;
            ctx.fillRect(x, y, 1, 1);
        }*/

        const threeTexture = new THREE.Texture(
            undefined,
            THREE.UVMapping,
            this.wrapToThreeWrap(textureNative.uAddressing),
            this.wrapToThreeWrap(textureNative.vAddressing),
            this.filterToThreeFilter(textureNative.filterMode),
            this.filterToThreeFilter(textureNative.filterMode),
            THREE.RGBAFormat,
            THREE.UnsignedByteType
        );
        threeTexture.mipmaps = textureNative.mipLevels.map((level, i) => new ImageData(
            new Uint8ClampedArray(level),
            textureNative.width / (2 ** i),
            textureNative.height / (2 ** i)
        ));
        threeTexture.image = threeTexture.mipmaps[0];

        threeTexture.generateMipmaps = false;
        threeTexture.flipY = false;
        threeTexture.unpackAlignment = 1;
        threeTexture.needsUpdate = true;

        return threeTexture;
    }

    wrapToThreeWrap(addressMode: RwsTextureAddressMode): THREE.Wrapping {
        return {
            [RwsTextureAddressMode.BORDER]: THREE.ClampToEdgeWrapping,
            [RwsTextureAddressMode.CLAMP]: THREE.ClampToEdgeWrapping,
            [RwsTextureAddressMode.MIRROR]: THREE.MirroredRepeatWrapping,
            [RwsTextureAddressMode.NONE]: THREE.ClampToEdgeWrapping,
            [RwsTextureAddressMode.REPEAT]: THREE.RepeatWrapping
        }[addressMode];
    }

    filterToThreeFilter(filterMode: RwsTextureFilterMode): THREE.TextureFilter {
        return {
            [RwsTextureFilterMode.NONE]: THREE.LinearFilter,
            [RwsTextureFilterMode.NEAREST]: THREE.NearestFilter,
            [RwsTextureFilterMode.LINEAR]: THREE.LinearFilter,
            [RwsTextureFilterMode.MIP_NEAREST]: THREE.NearestMipMapNearestFilter,
            [RwsTextureFilterMode.MIP_LINEAR]: THREE.NearestMipMapLinearFilter,
            [RwsTextureFilterMode.LINEAR_MIP_NEAREST]: THREE.LinearMipMapNearestFilter,
            [RwsTextureFilterMode.LINEAR_MIP_LINEAR]: THREE.LinearMipMapLinearFilter,
        }[filterMode];
    }
}
