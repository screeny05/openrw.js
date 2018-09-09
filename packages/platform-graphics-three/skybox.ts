import { SphereBufferGeometry, ShaderMaterial, Mesh, BackSide, Color } from "three";
import { ThreeMesh } from "./mesh";
import { ISkybox } from "@rws/platform/graphic/skybox";
import { GlobalState } from "@rws/game/global-state";
import { TimecycIndex } from "@rws/library/index/timecyc";

const vertexShader = `
    varying vec3 vWorldPosition;

    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;

    varying vec3 vWorldPosition;

    void main() {
        float h = normalize(vWorldPosition).z;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
    }
`;

export class Skybox extends ThreeMesh implements ISkybox {
    state: GlobalState;
    timecyc: TimecycIndex;

    constructor(state: GlobalState, timecyc: TimecycIndex){
        const geom = new SphereBufferGeometry(4000, 8, 10);
        const mat = new ShaderMaterial({
            uniforms: {
                topColor: { type: 'c', value: new Color(0x0077ff) },
                bottomColor: { type: 'c', value: new Color(0xffffff) },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: BackSide
        });
        const src = new Mesh(geom, mat);

        super(src);
        this.state = state;
        this.timecyc = timecyc;
    }

    update(delta: number): void {

    }
}
