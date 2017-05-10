#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying float varLightIntensity;

void main(){
    vec3 norm = normalize(varVPosition);
    float normX = max(norm.x, 0.5);
    float normY = max(norm.y, 0.5);
    float normZ = max(norm.z, 0.5);
    gl_FragColor = vec4(varLightIntensity * normX, varLightIntensity * normY, varLightIntensity * normZ, 1.0);
}
