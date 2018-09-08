import 'setimmediate';
import "regenerator-runtime/runtime";
import '../rwscore/parser-bin';

import { PlatformFileIndex } from '@rws/adapter/fs/browser/file-index';
import { PlatformInput } from '@rws/adapter/input/browser/input';
import { RwsStructPool } from 'packages/library/rws-struct-pool';
import { ThreeRenderer } from 'packages/platform-graphics-three/renderer';
import { ThreeMeshProvider } from './graphics/mesh-provider';
import { InputControlMapper } from '../rwscore/control/mapper';
import { defaultMap } from '../rwscore/control/default-map';
import { Control } from '../rwscore/control/control';

const $select = <HTMLInputElement>document.querySelector('.js--folder-select');
const $reload = <HTMLButtonElement>document.querySelector('.js--reload');

let platform: WebPlatform | null = null;

const setupPlatform = async () => {
    platform = new WebPlatform($select.files);

    $select.style.display = 'none';

    await platform.load();
    platform.start();
};

$select.addEventListener('change', setupPlatform);

$reload.addEventListener('click', () => {
    if(platform){
        platform.stop();
        platform.renderer.renderer.domElement.remove();
    }
    setupPlatform();
});

export class WebPlatform {
    fileIndex: PlatformFileIndex;
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshProvider;
    renderer: ThreeRenderer;
    input: PlatformInput;
    controls: InputControlMapper;

    lastTime: number;
    gameTime: number;
    gameTimeMultiplier: number = 1;

    isRunning: boolean = false;

    constructor(files: FileList | null){
        this.fileIndex = new PlatformFileIndex(files);
        this.rwsPool = new RwsStructPool(this.fileIndex);

        this.meshProvider = new ThreeMeshProvider(this.rwsPool);
        this.renderer = new ThreeRenderer(this.meshProvider, this);
        this.input = new PlatformInput(document.documentElement);
        this.controls = new InputControlMapper(defaultMap, this.input);
    }

    async load(): Promise<void> {
        await this.fileIndex.init();
        await this.rwsPool.load();
        await this.renderer.setupScene();

        if(!this.rwsPool.isValidPath()){
            throw new Error('Given Path does not contain Gamefiles');
        }
    }

    start(): void {
        this.isRunning = true;
        this.gameTime = 12;
        this.lastTime = this.gameTime;
        this.requestTick();
    }

    stop(): void {
        this.isRunning = false;
    }

    requestTick(): void {
        if(!this.isRunning){
            return;
        }
        requestAnimationFrame(time => this.tick(time));
    }

    tick(time: number): void {
        const delta = time - this.lastTime;
        this.lastTime = time;
        this.gameTime += delta / 1000 / 60 * this.gameTimeMultiplier;
        //console.log(Math.floor(this.gameTime % 24) + ':' + Math.floor(this.gameTime * 60) % 60);

        const forward = this.controls.getState(Control.MoveForwardOnFoot) * delta * 0.01;
        const backward = this.controls.getState(Control.MoveBackwardOnFoot) * delta * 0.01;
        const left = this.controls.getState(Control.MoveLeft) * delta * 0.01;
        const right = this.controls.getState(Control.MoveRight) * delta * 0.01;
        const movementSidewards = this.renderer.camera.getWorldDirection().clone().cross(this.renderer.camera.up).multiplyScalar(right - left);
        this.renderer.camera.position.addScaledVector(this.renderer.camera.getWorldDirection(), forward - backward);
        this.renderer.camera.position.add(movementSidewards);
        const newRotationZ = this.renderer.camera.rotation.z + this.controls.getState(Control.LookY) * delta * -0.0002;
        const newRotationX = this.renderer.camera.rotation.x + this.controls.getState(Control.LookX) * delta * -0.0002;

        this.renderer.camera.rotation.z = newRotationZ;
        if(newRotationX < Math.PI && newRotationX > 0){
            this.renderer.camera.rotation.x = newRotationX;
        }

        this.renderer.update(delta);
        this.controls.update(delta);
        this.requestTick();
    }
}
