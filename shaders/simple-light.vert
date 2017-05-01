#define M_PI 3.1415926535897932384626433832795

attribute vec3 vPosition;

uniform vec3 faceNormal;
uniform vec3 aColor;
uniform vec3 bColor;
uniform vec3 cColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 varVPosition;
varying float varLightIntensity;

vec3 lightDirectionVector = vec3(0.0, 1.0, -0.2);

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main(){
    float lightAngle = clamp(dot(lightDirectionVector, faceNormal), 0.0, M_PI / 2.0);

    varVPosition = vPosition;
    varLightIntensity = map(lightAngle, 0.0, M_PI / 2.0, 0.5, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
