import 'setimmediate';
import "regenerator-runtime/runtime";
import '../rwscore/parser-bin';

import { PlatformFileIndex } from './platform/file-index';
import { RwsStructPool } from '../rwscore/rws-struct-pool';
import { ThreeRenderer } from './graphics/renderer';
import { ThreeMeshProvider } from './graphics/mesh-provider';
import { InputControlMapper } from '../rwscore/control/mapper';
import { defaultMap } from '../rwscore/control/default-map';
import { PlatformInput } from './platform/input';
import { Control } from '../rwscore/control/control';

const $select: HTMLInputElement = <any>document.querySelector('.js--folder-select');

$select.addEventListener('change', async () => {
    const platform = new WebPlatform($select.files);

    $select.remove();

    await platform.load();
    platform.start();
});

class WebPlatform {
    fileIndex: PlatformFileIndex;
    rwsPool: RwsStructPool;
    meshProvider: ThreeMeshProvider;
    renderer: ThreeRenderer;
    input: PlatformInput;
    controls: InputControlMapper;

    isRunning: boolean = false;

    constructor(files: FileList | null){
        this.fileIndex = new PlatformFileIndex(files);
        this.rwsPool = new RwsStructPool(this.fileIndex);

        if(!this.rwsPool.isValidPath()){
            throw new Error('Given Path does not contain Gamefiles');
        }

        this.meshProvider = new ThreeMeshProvider(this.rwsPool);
        this.renderer = new ThreeRenderer(this.meshProvider);
        this.input = new PlatformInput(document.documentElement);
        this.controls = new InputControlMapper(defaultMap, this.input);
    }

    async load(): Promise<void> {
        await this.rwsPool.load();
        await this.renderer.setupScene();
    }

    start(): void {
        this.isRunning = true;
        this.requestTick();
    }

    requestTick(): void {
        if(!this.isRunning){
            return;
        }
        requestAnimationFrame(delta => this.tick(delta));
    }

    tick(delta: number): void {
        const forward = this.controls.getState(Control.MoveForwardOnFoot) * delta * 0.00001;
        const backward = this.controls.getState(Control.MoveBackwardOnFoot) * delta * 0.00001;
        const left = this.controls.getState(Control.MoveLeft) * delta * 0.00001;
        const right = this.controls.getState(Control.MoveRight) * delta * 0.00001;
        const movementSidewards = this.renderer.camera.getWorldDirection().clone().cross(this.renderer.camera.up).multiplyScalar(right - left);
        this.renderer.camera.position.addScaledVector(this.renderer.camera.getWorldDirection(), forward - backward);
        this.renderer.camera.position.add(movementSidewards);
        const newRotationZ = this.renderer.camera.rotation.z + this.controls.getState(Control.LookY) * delta * -0.0000002;
        const newRotationX = this.renderer.camera.rotation.x + this.controls.getState(Control.LookX) * delta * -0.0000002;

        this.renderer.camera.rotation.z = newRotationZ;
        if(newRotationX < Math.PI && newRotationX > 0){
            this.renderer.camera.rotation.x = newRotationX;
        }

        this.renderer.update(delta);
        this.controls.update(delta);
        this.requestTick();
    }
}
