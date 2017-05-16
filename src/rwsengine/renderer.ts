import Shader from './shader';
import Camera from './camera';
import NativeWindow from './native-window';

import Geometry from './geometry';

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

        this.gl.uniformMatrix4fv(this.worldShader.pointers.viewMatrix, false, this.camera.getViewMatrix());
        this.gl.uniformMatrix4fv(this.worldShader.pointers.projectionMatrix, false, this.camera.projection);
    }

    render(){
        this.preRender();

        this.world.geometries.forEach(this.renderGeometry);
    }

    @Bind()
    renderGeometry(geometry: Geometry|null = null){
        if(!geometry || !geometry.doRender){
            return;
        }

        this.gl.uniformMatrix4fv(this.worldShader.pointers.modelMatrix, false, geometry.worldTransform);
        this.renderElementBuffer(geometry, this.worldShader.pointers.vPosition, this.worldShader.pointers.vColor, this.worldShader.pointers.vUVCoords, this.worldShader.pointers.uSampler);

        geometry.children.forEach(this.renderGeometry);
    }

    renderFace3Buffer(buffer, vertexPositionAttribute, drawingMode = this.gl.TRIANGLES){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(drawingMode, 0, 3);
    }

    renderElementBuffer(geometry: Geometry, vertexPositionAttribute, vertexColorAttribute, vertexUvAttribute, samplerUniform, drawingMode = this.gl.TRIANGLES){
        if(!geometry.vertexBuffer || !geometry.indexBuffer){
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.vertexBuffer);
        this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.colorBuffer);
        this.gl.vertexAttribPointer(vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.uvBuffer);
        this.gl.vertexAttribPointer(vertexUvAttribute, 2, this.gl.FLOAT, false, 0, 0);

        const texture = geometry.textures.length > 0 ? geometry.textures[1].glTexture : null;

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(samplerUniform, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
        this.gl.drawElements(drawingMode, geometry.faces.length, this.gl.UNSIGNED_SHORT, 0);
    }
}
