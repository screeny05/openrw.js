#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying vec4 varVColor;
varying vec2 varUVCoords;

uniform sampler2D uSampler;

void main(){
    gl_FragColor = texture2D(uSampler, varUVCoords) + varVColor;
}
