import { ThreeScene } from './scene';
import { RwsStructPool } from "@rws/library/rws-struct-pool";

import * as THREE from 'three';
import { Camera, Renderer, WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { ThreeMeshPool } from "@rws/platform-graphics-three/mesh-pool";
import { IRenderer } from "@rws/platform/graphic";
import { ThreeObject3d } from '@rws/platform-graphics-three/object3d';
import { ThreeCamera } from '@rws/platform-graphics-three/camera';

export class ThreeRenderer implements IRenderer {
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshPool;

    scene: ThreeScene;
    camera: ThreeCamera;
    renderer: Renderer;

    constructor(rwsPool: RwsStructPool, scene: ThreeScene, camera: ThreeCamera){
        this.scene = scene;
        this.rwsPool = rwsPool;

        this.camera = camera;
        this.renderer = new WebGLRenderer({
            antialias: true,
            canvas: document.querySelector('.js--canvas') as HTMLCanvasElement
        });

        this.setRendererSize();
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.setRendererSize.bind(this));

        this.setupScene();
    }

    setupScene(): void {
        const gridHelper = new THREE.GridHelper(10, 10);
        const axesHelper = new THREE.AxesHelper(10);

        const light1 = new THREE.PointLight(0xffffff, 1, 0);
        const light2 = new THREE.PointLight(0xffffff, 1, 0);
        const light3 = new THREE.PointLight(0xffffff, 1, 0);

        gridHelper.rotateX(Math.PI / 2);
        light1.position.set(0, 200, 0);
        light2.position.set(100, 200, 100);
        light3.position.set(-100, -200, -100);

        this.scene.add(new ThreeObject3d(gridHelper));
        //this.scene.add(new ThreeObject3d(light1));
        //this.scene.add(new ThreeObject3d(axesHelper), new ThreeObject3d(light1), new ThreeObject3d(light2), new ThreeObject3d(light3));
    }

    setRendererSize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(delta: number): void {
        this.renderer.render(this.scene.src, this.camera.src);
    }
}
