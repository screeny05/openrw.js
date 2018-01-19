import { NativeWindow } from '@glaced/lwngl';
import { GLES2Context, glContext } from '@glaced/gles2-2.0';

import * as fs from 'fs';
import * as path from 'path';

import bind from 'bind-decorator';
import { EventEmitter } from 'events';
import * as Corrode from 'corrode';

import './rwslib/parsers';


import { getGlDebugProxy } from './rwsengine/gl-debug';
import Shader from './rwsengine/shader';
import Camera from './rwsengine/camera';
import CameraControlsOrbital from './rwsengine/camera-controls-orbital';
import Input from './rwsengine/input';

import { mat4 } from 'gl-matrix';


export default class Game extends EventEmitter {
    window: NativeWindow<GLES2Context>;
    isRunning: boolean = false;
    lastTime: number = 0;
    framesCount: number = 0;
    framesMeasureCount: number = 0;

    timeoutMeasureFps: NodeJS.Timer;

    input: Input;
    camera: Camera;
    cameraControls: CameraControlsOrbital;

    constructor(){
        super();

        this.window = new NativeWindow<GLES2Context>({
            title: 'TestGL',
            context: getGlDebugProxy(glContext, {
                enableLogging: process.argv.indexOf('--log') !== -1,
                sanityCheck: true
            })
        });
        this.window.on('close', this.onWindowClose);

        this.input = new Input(this.window);
        this.camera = new Camera(Math.PI / 180 * 60, this.window);
        this.cameraControls = new CameraControlsOrbital(this.input, this.camera);
        this.cameraControls.forwardSpeed = 5;
    }

    @bind
    onWindowClose(){
        clearTimeout(this.timeoutMeasureFps);
    }

    start(){
        this.isRunning = true;
        this.tick();
        this.measureFps();
    }

    @bind
    tick(currentTime: number = 0){
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.framesCount++;

        this.input.update(delta);
        this.cameraControls.update(delta);

        this.emit('frame', delta);

        if(this.isRunning){
            this.window.requestFrame(this.tick);
        }
    }

    @bind
    measureFps(){
        this.emit('fps', this.framesCount, this.framesMeasureCount);
        this.framesMeasureCount++;
        this.framesCount = 0;
        this.timeoutMeasureFps = setTimeout(this.measureFps, 1000);
    }
}

const x = new Game();
const gl = x.window.context;

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, .5, .5, 1);

const shader = new Shader(gl, `
attribute vec3 vPosition;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 pos;
void main(){
    pos = vPosition;
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(vPosition, 1.0);
}
`, `
#ifdef GL_ES
precision highp float;
#endif
varying vec3 pos;
void main(){
    gl_FragColor = vec4(pos, 1.0);
}
`, {
    vPosition: 'attribute',
    projectionMatrix: 'uniform',
    modelMatrix: 'uniform',
    viewMatrix: 'uniform',
});

gl.enableVertexAttribArray(shader.pointers.vPosition);

const modelMatrix = mat4.create();

const dataToBuffer = data => {
    const buffer = gl.genBuffers(1)[0];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
};

const drawFace3Buffer = (buffer, vertexPositionAttribute) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

const createModel = polygons => polygons.map(vertices => dataToBuffer(new Float32Array(vertices)));

const models: any[] = [];

const parser = new Corrode();
parser.ext.rws('rws').map.push('rws');
const filePath = path.join('./fixtures/game/asuka.dff');
const fstream = fs.createReadStream(filePath);
fstream.pipe(parser);
parser.on('finish', function(){
    const geometry = parser.vars[0].geometryList.geometries[0];
    const triangles = geometry.triangles;
    const vertices = geometry.morphTargets[0].vertices;

    models.push(createModel(triangles.map(triangle => {
        const vert1 = vertices[triangle.vertex1];
        const vert2 = vertices[triangle.vertex2];
        const vert3 = vertices[triangle.vertex3];
        return [
            vert1[0], vert1[1], vert1[2],
            vert2[0], vert2[1], vert2[2],
            vert3[0], vert3[1], vert3[2]
        ];
    })));
});

shader.use();

x.start();

const drawGrid = () => {

};

x.on('frame', delta => {
    gl.viewport(0, 0, x.window.fbWidth, x.window.fbHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.uniformMatrix4fv(shader.pointers.viewMatrix, false, x.camera.getViewMatrix());
    gl.uniformMatrix4fv(shader.pointers.projectionMatrix, false, x.camera.projection);

    shader.use();
    models.forEach(model => {
        mat4.identity(modelMatrix);
        gl.uniformMatrix4fv(shader.pointers.modelMatrix, false, modelMatrix);

        model.forEach(vertexBuffer => {
            drawFace3Buffer(vertexBuffer, shader.pointers.vPosition);
        });
    });

    drawGrid();
});
