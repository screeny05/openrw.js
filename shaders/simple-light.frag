#ifdef GL_ES
    precision highp float;
#endif

varying vec3 varVPosition;
varying vec4 varVColor;
varying vec2 varUVCoords;



uniform float ambient;
uniform float diffuse;
uniform float specular;

uniform sampler2D uSampler;
uniform vec4 materialColor;
uniform bool isTextured;

float alphaThreshold = (1.0 / 255.0);

void main(){
    vec4 diffuse = varVColor;
    vec4 textureColor = texture2D(uSampler, varUVCoords);
    diffuse.rgb += textureColor.rgb;
    diffuse.a *= textureColor.a;
    diffuse.rgb *= ambient;

    //if(diffuse.a <= alphaThreshold){ discard; }

    //gl_FragColor = diffuse;
    gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);
}
