#define M_PI 3.1415926535897932384626433832795

attribute vec3 vPosition;
attribute vec4 vColor;
attribute vec2 vUVCoords;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 varVPosition;
varying vec4 varVColor;
varying vec2 varUVCoords;

void main(){
    varVPosition = vPosition;
    varVColor = vColor;
    varUVCoords = vUVCoords;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
