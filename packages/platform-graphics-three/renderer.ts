import { RwsStructPool } from "@rws/library/rws-struct-pool";

import * as THREE from 'three';
import { Scene, Camera, Renderer, WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { ThreeMeshProvider } from "./mesh-provider";

export class ThreeRenderer {
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshProvider;

    scene: Scene;
    camera: Camera;
    renderer: Renderer;

    skyboxMaterial: THREE.ShaderMaterial;
    ambientLight: THREE.AmbientLight;

    constructor(meshProvider: ThreeMeshProvider){
        this.meshProvider = meshProvider;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new WebGLRenderer({ antialias: true });

        this.setRendererSize();
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.setRendererSize.bind(this));
    }

    async setupScene(): Promise<void> {
        const gridHelper = new THREE.GridHelper(10, 10);
        const axesHelper = new THREE.AxesHelper(10);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        const light1 = new THREE.PointLight(0xffffff, 1, 0);
        const light2 = new THREE.PointLight(0xffffff, 1, 0);
        const light3 = new THREE.PointLight(0xffffff, 1, 0);

        const model = await this.meshProvider.getMesh('asuka');
        this.scene.add(model._object3d);

        gridHelper.rotateX(Math.PI / 2);
        light1.position.set(0, 200, 0);
        light2.position.set(100, 200, 100);
        light3.position.set(-100, -200, -100);

        this.scene.add(gridHelper, axesHelper, this.ambientLight, light1, light2, light3);
        this.setupSkydome();

        this.camera.rotation.order = 'ZXY';
        this.camera.up = new Vector3(0, 0, 1);
        this.camera.position.y = 3;
        this.camera.position.z = 2;
        this.camera.lookAt(0, 0, 0);
    }

    setupSkydome(): void {
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
            uniform float offset;
            uniform float exponent;

            varying vec3 vWorldPosition;

            void main() {
                float h = normalize(vWorldPosition + offset).z;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `;
        const uniforms = {
            topColor: { type: 'c', value: new THREE.Color(0x0077ff) },
            bottomColor: { type: 'c', value: new THREE.Color(0xffffff) },
            offset: { type: 'f', value: 1000 },
            exponent: { type: 'f', value: 1 }
        };
        const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });
        this.skyboxMaterial = skyMat;
        const sky = new THREE.Mesh(skyGeo, skyMat);

        this.scene.add(sky);
    }

    updateTimecyc(): void {
        /*const timecyc = this.webPlatform.rwsPool.timecycIndex.getInterpolatedTimecycEntry(0, this.webPlatform.gameTime);
        setThreeColorFromGlVec3(timecyc.skyTopColor, this.skyboxMaterial.uniforms.topColor.value);
        setThreeColorFromGlVec3(timecyc.skyBottomColor, this.skyboxMaterial.uniforms.bottomColor.value);
        setThreeColorFromGlVec3(timecyc.ambientColor, this.ambientLight.color);*/
    }

    setRendererSize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(delta: number): void {
        this.updateTimecyc();
        this.renderer.render(this.scene, this.camera);
    }
}
