#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying vec4 varVColor;
varying float varLightIntensity;

void main(){
    //vec3 norm = normalize(varVPosition);
    //gl_FragColor = vec4(.7, .7, .7, 1.0);//vec4(varVColor, 1.0);//vec4(varVColor, varLightIntensity, varLightIntensity, 1.0);
    gl_FragColor = varVColor;
    //gl_FragColor = vec4(varVPosition, 1.0);
    //gl_FragColor = vec4(varVPosition, 1.0);
}
