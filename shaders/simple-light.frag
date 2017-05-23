#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying vec4 varVColor;
varying vec2 varUVCoords;

uniform sampler2D uSampler;
uniform vec4 materialColor;
uniform bool isTextured;

void main(){
    gl_FragColor = (isTextured ? texture2D(uSampler, varUVCoords) : materialColor) + varVColor - vec4(0.0,0.0,0.0,1.0);
}
