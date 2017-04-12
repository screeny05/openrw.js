import NativeWindow from './native-window';
import Controls from './controls';

import { mat4, vec3 } from 'gl-matrix';
import * as Corrode from 'corrode';

import * as fs from 'fs';
import * as path from 'path';

const config = require('../../config.json');
require('../rwslib/parsers');

const window = new NativeWindow({
    title: 'openrwjs 0.0.1'
});

const controls = new Controls(window);

const gl = window.gl;


const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

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

const createBuffer = data => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
};

const drawFace3Buffer = (buffer, vertexPositionAttribute) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

const degToRad = deg => deg * Math.PI / 180;

const { shaderProgram, shaderLocations } = buildShaderProgram(`

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

gl.enableVertexAttribArray(shaderLocations.vPosition);

gl.useProgram(shaderProgram);

const createModel = polygons => polygons.map(vertices => createBuffer(new Float32Array(vertices)));


const models = [];

const parser = new Corrode();
parser.ext.rws('rws').map.push('rws');
const filePath = path.join(config.paths.base, 'newramp2.dff');
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
            vert1.x, vert1.y, vert1.z,
            vert2.x, vert2.y, vert2.z,
            vert3.x, vert3.y, vert3.z
        ]
    })));
});

gl.clearColor(0, 1, 0, 0);

const controlToVec = (statePos: number, stateNeg: number): number => (statePos ? statePos : stateNeg * -1) * 0.1;

let currentTime = 0;
const render = () => {
    gl.viewport(0, 0, window.width, window.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const moveVector = vec3.fromValues(controlToVec(controls.states.left, controls.states.right), 0, controlToVec(controls.states.forward, controls.states.backward));
    mat4.rotateY(viewMatrix, viewMatrix, controls.states.rotationX * 0.1);
    mat4.translate(viewMatrix, viewMatrix, moveVector);

    mat4.perspective(projectionMatrix, degToRad(60), window.width / window.height, 0.1, 1000);
    gl.uniformMatrix4fv(shaderLocations.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(shaderLocations.projectionMatrix, false, projectionMatrix);

    models.forEach(model => {
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [0.5, 0, -2]);
        //mat4.rotateY(modelMatrix, modelMatrix, currentTime);
        gl.uniformMatrix4fv(shaderLocations.modelMatrix, false, modelMatrix);

        model.forEach(vertexBuffer => {
            drawFace3Buffer(vertexBuffer, shaderLocations.vPosition);
        });
    });

    currentTime = (currentTime + 0.01);
    window.requestAnimationFrame(render);
};

render();
