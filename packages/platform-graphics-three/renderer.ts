import { ThreeScene } from './scene';
import { RwsStructPool } from "@rws/library/rws-struct-pool";

import * as THREE from 'three';
import { Camera, Renderer, WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { ThreeMeshPool } from "@rws/platform-graphics-three/mesh-pool";
import { IRenderer } from "@rws/platform/graphic";
import { ThreeObject3d } from '@rws/platform-graphics-three/object3d';
import { ThreeCamera } from '@rws/platform-graphics-three/camera';
import { ThreeHud } from '@rws/platform-graphics-three/hud';
import { ThreeTexture } from './texture';

export class ThreeRenderer implements IRenderer {
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshPool;

    scene: ThreeScene;
    hud: ThreeHud;
    camera: ThreeCamera;
    renderer: WebGLRenderer;

    constructor(rwsPool: RwsStructPool, scene: ThreeScene, hud: ThreeHud, camera: ThreeCamera){
        this.scene = scene;
        this.hud = hud;
        this.rwsPool = rwsPool;

        this.camera = camera;
        this.renderer = new WebGLRenderer({
            antialias: true,
            canvas: document.querySelector('.js--canvas') as HTMLCanvasElement
        });
        this.renderer.autoClear = false;

        this.setRendererSize();
        window.addEventListener('resize', this.setRendererSize.bind(this));

        this.setupScene();
    }

    setupScene(): void {
        const gridHelper = new THREE.GridHelper(10, 8);
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

    addWater(): void {
        const MAP_SIZE = 4096;
        const MAP_OFFSET = MAP_SIZE / 2;
        const WATERLEVEL_SIZE = 128;
        const PLANE_SIZE = MAP_SIZE / WATERLEVEL_SIZE;

        const texture = this.rwsPool.texturePool.get('water_old') as ThreeTexture;
        const plane = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 1, 1);
        let mergedGeometry = new THREE.Geometry();
        const mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshBasicMaterial({ map: texture.src }));
        mesh.name = 'water';

        const addPlane = (x: number, y: number, level: number): void => {
            const cloned = plane.clone();
            cloned.translate(x + PLANE_SIZE / 2, y + PLANE_SIZE / 2, level);
            mergedGeometry.merge(cloned);
        };

        this.rwsPool.waterpro.physicalLevels.forEach((level, i) => {
            if(typeof level !== 'undefined'){
                const y = i % WATERLEVEL_SIZE;
                const x = Math.floor(i / WATERLEVEL_SIZE);
                addPlane(x * PLANE_SIZE - MAP_OFFSET, y * PLANE_SIZE - MAP_OFFSET, level);
            }
        });

        this.scene.add(new ThreeObject3d(mesh));

        /*this.rwsPool.waterpro.zones.forEach((zone, i) => {
            addPlane(Math.abs(zone.startX - zone.endX), Math.abs(zone.startY - zone.endY), zone.startX, zone.startY, 0, 0x0000f9);
        });*/
    }

    removeWater(): void {
        const water = this.scene.getByName('water');
        if(!water){
            return;
        }
        water.removeFromParent();
    }

    setRendererSize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.src.aspect = window.innerWidth / window.innerHeight;
        this.camera.src.updateProjectionMatrix();
    }

    render(delta: number): void {
        this.renderer.render(this.scene.src, this.camera.src);
        this.renderer.render(this.hud.src, this.hud.camera);
    }
}
