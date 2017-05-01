#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying float varLightIntensity;

void main(){
    gl_FragColor = vec4(varLightIntensity, varLightIntensity, varLightIntensity, 1.0);
}
