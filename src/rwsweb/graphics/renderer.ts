import { RwsStructPool } from "../../rwscore/rws-struct-pool";

import * as THREE from 'three';
import { RwsSectionType, RwsAtomic } from "../../rwscore/type/rws/index";
import { quat } from 'gl-matrix';
import { Scene, Camera, Renderer, WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { ThreeMeshProvider } from "./mesh-provider";

export class ThreeRenderer {
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshProvider;

    scene: Scene;
    camera: Camera;
    renderer: Renderer;

    constructor(meshProvider: ThreeMeshProvider){
        this.meshProvider = meshProvider;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ antialias: true });

        this.setRendererSize();
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.setRendererSize.bind(this));
    }

    async setupScene(): Promise<void> {
        const gridHelper = new THREE.GridHelper(10, 10);
        const axesHelper = new THREE.AxesHelper(10);

        const ambientLight = new THREE.AmbientLight(0x404040);
        const light1 = new THREE.PointLight(0xffffff, 1, 0);
        const light2 = new THREE.PointLight(0xffffff, 1, 0);
        const light3 = new THREE.PointLight(0xffffff, 1, 0);

        const asuka = await this.meshProvider.getMesh('asuka');

        gridHelper.rotateX(Math.PI / 2);
        light1.position.set(0, 200, 0);
        light2.position.set(100, 200, 100);
        light3.position.set(-100, -200, -100);

        this.scene.add(gridHelper, axesHelper, ambientLight, light1, light2, light3);
        this.scene.add(asuka._object3d);

        this.camera.rotation.order = 'ZXY';
        this.camera.up = new Vector3(0, 0, 1);
        this.camera.position.y = 5;
        this.camera.lookAt(0, 0, 0);
    }

    setRendererSize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(delta: number): void {
        this.renderer.render(this.scene, this.camera);
    }
}
