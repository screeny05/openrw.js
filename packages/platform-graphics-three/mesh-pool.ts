import { RwsStructPool } from '@rws/library/rws-struct-pool';
import {
    RwsSectionType,
    RwsAtomic,
    RwsMaterial,
    RwsGeometryMaterialList,
    RwsClump
} from "@rws/library/type/rws";

import { IMeshPool } from "@rws/platform/graphic";

import * as THREE from 'three';
import { quat } from 'gl-matrix';
import { ThreeMesh } from "@rws/platform-graphics-three/mesh";
import { glVec2ToThreeVector2 } from '@rws/platform-graphics-three/converter';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';

export class ThreeMeshPool implements IMeshPool {
    rwsPool: RwsStructPool;

    meshCache: Map<string, ThreeMesh> = new Map();
    loadedFiles: string[] = [];

    constructor(rwsPool: RwsStructPool){
        this.rwsPool = rwsPool;
    }

    get(name: string): ThreeMesh {
        if(!this.meshCache.has(name)){
            throw new Error(`MeshPool: ${name} is not yet loaded.`);
        }
        return this.meshCache.get(name) as ThreeMesh;
    }

    async loadFromFile(fileName: string): Promise<void> {
        fileName = this.rwsPool.fileIndex.normalizePath(fileName);
        if(this.loadedFiles.includes(fileName)){
            return;
        }

        const clump = await this.rwsPool.parseRws(fileName, RwsSectionType.RW_CLUMP) as RwsClump;
        if(!clump){
            throw new Error(`MeshPool: ${fileName} not found.`);
        }
        await this.populateFromClump(clump, this.removeFileExtension(fileName));
        this.loadedFiles.push(fileName);
    }

    async loadFromImg(imgName: string, fileName: string): Promise<void> {
        fileName = this.rwsPool.fileIndex.normalizePath(fileName);
        const combinedPath = `${imgName}/${fileName}`;
        if(this.loadedFiles.includes(combinedPath)){
            return;
        }

        const clump = await this.rwsPool.parseRwsFromImg(imgName, fileName, RwsSectionType.RW_CLUMP) as RwsClump;
        if(!clump){
            throw new Error(`MeshPool: ${fileName} not found in ${imgName}.`);
        }
        await this.populateFromClump(clump, this.removeFileExtension(fileName));
        this.loadedFiles.push(combinedPath);
    }

    removeFileExtension(path: string): string {
        return path.substring(0, path.length - 4);
    }

    async populateFromClump(clump: RwsClump, name: string): Promise<void> {
        const mesh = await this.clumpToThreeMesh(clump, name);
        this.meshCache.set(name, mesh);
    }

    async clumpToThreeMesh(clump: RwsClump, name: string): Promise<ThreeMesh> {
        const rootMesh = new THREE.Mesh();

        const threeMeshes = clump.atomics.map(atomic => {
            const mesh = this.atomicToThreeMesh(atomic);
            const materials = this.materialListToThreeMaterials(atomic.geometry.materialList, atomic.geometry.flags.prelit);

            // Typings bug - Mesh.prototype.material accepts THREE.Material[]
            mesh.material = materials as any;
            mesh.name = clump.frameList.extensions[atomic.frameIndex].sections[0].name;

            return mesh;
        });

        threeMeshes.forEach((mesh, i) => {
            const parentThree = threeMeshes.find((_, j) => clump.atomics[j].frameIndex === clump.atomics[i].frame.parentFrameId);
            if(!parentThree){
                rootMesh.add(mesh);
            } else {
                parentThree.add(mesh);
            }
        });
        rootMesh.name = '__root__' + name;

        return new ThreeMesh(rootMesh);
    }

    atomicToThreeMesh(atomic: RwsAtomic): THREE.Mesh {
        const geometry = new THREE.Geometry();

        const rwGeometry = atomic.geometry;
        const morphTarget = rwGeometry.morphTargets[0];
        const vertices = morphTarget.vertices;
        const vertexColors = rwGeometry.colors;
        const vertexNormals = morphTarget.normals;
        const faceUVCoordinates = rwGeometry.textureCoordinates[0];
        const faces = rwGeometry.triangles;

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
                glVec2ToThreeVector2(faceUVCoordinates[face.vertex1]),
                glVec2ToThreeVector2(faceUVCoordinates[face.vertex2]),
                glVec2ToThreeVector2(faceUVCoordinates[face.vertex3]),
            ]);
        });
        geometry.uvsNeedUpdate = true;
        geometry.computeFaceNormals();

        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(morphTarget.spherePosition[0], morphTarget.spherePosition[1], morphTarget.spherePosition[2]), morphTarget.sphereRadius);

        const mesh = new THREE.Mesh(geometry);

        const rotationQ = quat.create();
        quat.fromMat3(rotationQ, atomic.frame.rotation);

        mesh.position.set(atomic.frame.position[0], atomic.frame.position[1], atomic.frame.position[2]);
        mesh.quaternion.set(rotationQ[0], rotationQ[1], rotationQ[2], rotationQ[3]);
        mesh.visible = faces.length > 0;
        return mesh;
    }

    materialListToThreeMaterials(materialList: RwsGeometryMaterialList, isPrelit: boolean): THREE.Material[] {
        let currentIndex = 0;
        const instancedMaterials = materialList.materialIndices.map(index => {
            if(index !== -1){
                return null;
            }
            return this.materialToThreeMaterial(materialList.materials[currentIndex++], isPrelit);
        });

        const materials = materialList.materialIndices.map((index, i) => {
            const instanceIndex = index === -1 ? i : index;
            const material = instancedMaterials[instanceIndex];
            if(!material){
                throw new Error(`Material with index ${instanceIndex} not found.`);
            }
            return material;
        });
        return materials;
    }

    materialToThreeMaterial(material: RwsMaterial, isPrelit: boolean): THREE.Material {
        const [r, g, b, a] = material.color;
        const color = new THREE.Color(r / 255, g / 255, b / 255);

        const threeMaterial = new THREE.MeshLambertMaterial({
            color,
            flatShading: true,
            vertexColors: isPrelit ? THREE.VertexColors : THREE.NoColors,
        });

        if(material.isTextured){
            // force ITexturePool to ThreeTexturePool
            const texturePool = <ThreeTexturePool><any>this.rwsPool.texturePool;
            threeMaterial.map = texturePool.get(material.texture.name).src;
            if(material.texture.maskName){
                console.log('MASK!', material.texture.maskName);
                //threeMaterial.alphaMap = this.txtToTexture(material.texture.maskName, dictionary);
            }
        }

        return threeMaterial;
    }
}
