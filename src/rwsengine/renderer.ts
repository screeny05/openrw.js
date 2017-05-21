import Shader from './shader';
import Camera from './camera';
import NativeWindow from './native-window';

import Geometry from './geometry';
import Material from './materials/material';
import Mesh from './mesh';

import GameWorld from '../rwsgame/game-world';

import { Bind } from 'lodash-decorators';

export default class Renderer {
    gl: WebGLRenderingContext;
    window: NativeWindow;
    camera: Camera;

    world: GameWorld;

    worldShader: Shader;

    constructor(window: NativeWindow, camera: Camera, world: GameWorld){
        this.window = window;
        this.gl = this.window.gl;
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
            uSampler: 'uniform'
        });

        this.init();
    }

    init(){
        this.gl.useProgram(this.worldShader.program);
        this.gl.clearColor(0, 0, 0, 0);
    }

    preRender(){
        this.gl.viewport(0, 0, this.window.width, this.window.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.TEXTURE_2D);

        this.gl.uniformMatrix4fv(this.worldShader.pointers.viewMatrix, false, this.camera.getViewMatrix());
        this.gl.uniformMatrix4fv(this.worldShader.pointers.projectionMatrix, false, this.camera.projection);
    }

    render(){
        this.preRender();

        this.world.meshes.forEach(this.renderMesh);
    }

    @Bind()
    renderMesh(mesh: Mesh|null = null){
        if(!mesh){
            return;
        }

        this.gl.uniformMatrix4fv(this.worldShader.pointers.modelMatrix, false, mesh.worldTransform);

        if(mesh.geometry){
            mesh.geometry.indicesPerMaterialBuffer.forEach((materialIndicesBuffer, i) => {
                this.renderElementBuffer(
                    mesh.geometry,
                    mesh.materials[i],
                    materialIndicesBuffer,
                    this.worldShader.pointers.vPosition,
                    this.worldShader.pointers.vColor,
                    this.worldShader.pointers.vUVCoords,
                    this.worldShader.pointers.uSampler
                );
            });
        }


        mesh.children.forEach(this.renderMesh);
    }

    renderElementBuffer(geometry: Geometry, material: Material, materialIndicesBuffer: WebGLBuffer, vertexPositionAttribute, vertexColorAttribute, vertexUvAttribute, samplerUniform, drawingMode = this.gl.TRIANGLES){
        if(!geometry || !geometry.vertexBuffer){
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.vertexBuffer);
        this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.colorBuffer);
        this.gl.vertexAttribPointer(vertexColorAttribute, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.uvBuffer);
        this.gl.vertexAttribPointer(vertexUvAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, material.texture.glTexture);
        this.gl.uniform1i(samplerUniform, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, materialIndicesBuffer);
        this.gl.drawElements(drawingMode, geometry.faces.length, this.gl.UNSIGNED_SHORT, 0);
    }
}
