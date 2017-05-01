import NativeWindow from './native-window';
import Input from './input';
import Camera from './camera';
import CameraControlsOrbit from './camera-controls-orbital';

import Geometry from './geometry';
import DffGeometry from './dff-geometry';

import Game from '../rwsgame/game';

import { quat, mat4, vec3 } from 'gl-matrix';

import * as fs from 'fs';
import * as path from 'path';

require('../rwslib/parsers');

const window = new NativeWindow({
    title: 'openrwjs 0.0.1'
});

const degToRad = deg => deg * Math.PI / 180;
const input = new Input(window);
const camera = new Camera(degToRad(60), window);
const cameraControlsOrbit = new CameraControlsOrbit(input, camera);

const gl = window.gl;

const game = new Game(require('../../config.json'));



const compileShader = (source, type, additionalErrorInfo = '') => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        throw new Error(`Error compiling shader source.\n${gl.getShaderInfoLog(shader)}\n${additionalErrorInfo}`);
    }

    return shader;
};

const buildShaderProgram = (vertexShaderSource: string, fragmentShaderSource: string, locations: object = {}) => {
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, 'vertex-shader');
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, 'fragment-shader');

    const shaderLocations: any = {};

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        throw new Error(`Error compiling shader-program.\n${gl.getProgramInfoLog(shaderProgram)}`);
    }

    Object.keys(locations).forEach(key => {
        const locationType: string = locations[key];
        let location;

        if(locationType === 'attribute'){
            location = gl.getAttribLocation(shaderProgram, key);
        } else if(locationType === 'uniform'){
            location = gl.getUniformLocation(shaderProgram, key);
        } else {
            throw new TypeError(`Unknown type ${locationType}`);
        }

        shaderLocations[key] = location;
    });

    return { shaderProgram, shaderLocations };
};

let geometries: Array<Geometry> = [];
DffGeometry.loadFromDff(gl, process.argv[3], dffGeometries => geometries = geometries.concat(dffGeometries));
//DffGeometry.loadFromDff(gl, 'dff/player.dff', dffGeometries => geometries = geometries.concat(dffGeometries));

const drawFace3Buffer = (buffer, vertexPositionAttribute, drawingMode = gl.TRIANGLES) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(drawingMode, 0, 3);
};



const { shaderProgram, shaderLocations } = buildShaderProgram(`



`, `



`, {
    vPosition: 'attribute',
    faceNormal: 'uniform',
    aColor: 'uniform',
    bColor: 'uniform',
    cColor: 'uniform',
    projectionMatrix: 'uniform',
    modelMatrix: 'uniform',
    viewMatrix: 'uniform',
});

gl.enableVertexAttribArray(shaderLocations.vPosition);
gl.useProgram(shaderProgram);
gl.clearColor(0, 0, 0, 0);

let lastFpsTime = 0;
let framesSinceLastFpsTime = 0;
let lastTime = 0;
const render = (currentTime = 0) => {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    framesSinceLastFpsTime++;
    lastFpsTime += deltaTime;

    if(lastFpsTime > 1){
        //console.log(framesSinceLastFpsTime);
        lastFpsTime = 0;
        framesSinceLastFpsTime = 1;
    }

    input.update(deltaTime);
    cameraControlsOrbit.update(deltaTime);

    gl.viewport(0, 0, window.width, window.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.uniformMatrix4fv(shaderLocations.viewMatrix, false, camera.getViewMatrix());
    gl.uniformMatrix4fv(shaderLocations.projectionMatrix, false, camera.projection);

    geometries.forEach(geometry => {
        if(!geometry.doRender){
            return;
        }


        gl.uniformMatrix4fv(shaderLocations.modelMatrix, false, geometry.worldTransform);

        geometry.buffers.forEach((vertexBuffer, i) => {
            gl.uniform3fv(shaderLocations.faceNormal, geometry.faces[i].normal);

            drawFace3Buffer(vertexBuffer, shaderLocations.vPosition);
        });
    });

    window.requestAnimationFrame(render);
};

render();

(async () => {
    await game.init();
})();
