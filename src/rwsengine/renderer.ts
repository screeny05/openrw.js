import Shader from './shader';
import Camera from './camera';
import { GLES2Context } from '@glaced/gles2-2.0';
import { NativeWindow } from '@glaced/lwngl';

import Geometry from './geometry';
import Material from './materials/material';
import Mesh from './mesh';

import GameWorld from '../rwsgame/game-world';

import bind from 'bind-decorator';

export default class Renderer {
    gl: GLES2Context;
    window: NativeWindow<GLES2Context>;
    camera: Camera;

    world: GameWorld;

    worldShader: Shader;

    cullingEnabled: boolean = false;

    constructor(window: NativeWindow<GLES2Context>, camera: Camera, world: GameWorld){
        this.window = window;
        this.gl = this.window.context;
        this.camera = camera;
        this.world = world;

        this.worldShader = new Shader(this.gl, '../../shaders/simple-light.vert', '../../shaders/simple-light.frag', {
            vPosition: 'attribute',
            vColor: 'attribute',
            vUVCoords: 'attribute',
            faceNormal: 'uniform',
            projectionMatrix: 'uniform',
            modelMatrix: 'uniform',
            viewMatrix: 'uniform',
            uSampler: 'uniform',
            materialColor: 'uniform',
            isTextured: 'uniform',
            ambient: 'uniform',
            diffuse: 'uniform',
            specular: 'uniform'
        });

        this.init();
    }

    init(){
        this.gl.clearColor(0, 0.5, 0.5, 0);
    }

    preRender(){
        this.worldShader.use();
        this.gl.viewport(0, 0, this.window.fbWidth, this.window.fbHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.TEXTURE_2D);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.uniformMatrix4fv(this.worldShader.pointers.viewMatrix, false, this.camera.getViewMatrix());
        this.gl.uniformMatrix4fv(this.worldShader.pointers.projectionMatrix, false, this.camera.projection);
    }

    render(){
        this.preRender();
        this.world.meshes.forEach(this.renderMesh);
    }

    @bind
    renderMesh(mesh: Mesh|null = null){
        if(!mesh){
            return;
        }

        const { geometry } = mesh;

        if(geometry){
            this.gl.uniformMatrix4fv(this.worldShader.pointers.modelMatrix, false, mesh.worldTransform);

            geometry.indicesPerMaterialBuffer.forEach((materialIndicesBuffer, i) => {
                this.renderElementBuffer(geometry, mesh.materials[i], materialIndicesBuffer);
            });
        }

        mesh.children.forEach(this.renderMesh);
    }

    renderElementBuffer(geometry: Geometry, material: Material, materialIndicesBuffer: number, drawingMode = this.gl.TRIANGLES){
        if(!geometry || !geometry.vertexBuffer){
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.vertexBuffer);
        this.gl.vertexAttribPointer(this.worldShader.pointers.vPosition, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.colorBuffer);
        this.gl.vertexAttribPointer(this.worldShader.pointers.vColor, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.uvBuffer);
        this.gl.vertexAttribPointer(this.worldShader.pointers.vUVCoords, 2, this.gl.FLOAT, false, 0, 0);

        if(material.texture){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, material.texture.glTexture);
            this.gl.uniform1i(this.worldShader.pointers.uSampler, 0);
        }

        this.gl.uniform1f(this.worldShader.pointers.ambient, material.ambient);
        this.gl.uniform1f(this.worldShader.pointers.specular, material.specular);
        this.gl.uniform1f(this.worldShader.pointers.diffuse, material.diffuse);

        this.gl.uniform4fv(this.worldShader.pointers.materialColor, material.color);
        this.gl.uniform1i(this.worldShader.pointers.isTextured, material.texture ? 1 : 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, materialIndicesBuffer);
        this.gl.drawElements(drawingMode, geometry.faces.length, this.gl.UNSIGNED_SHORT, new Int32Array([0]));
    }
}
