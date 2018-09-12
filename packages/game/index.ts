import { PlatformAdapter } from '@rws/platform/adapter';
import { GlobalState } from './global-state';
import { Scene } from './scene';
import bind from 'bind-decorator';
import { CameraControlFree } from '@rws/game/camera-controls-free';

export class Game {
    platform: PlatformAdapter;
    stateGlobal: GlobalState;
    scene: Scene;
    cameraControls: CameraControlFree;

    constructor(platform: PlatformAdapter){
        this.platform = platform;
        this.platform.loop.setTickCallback(this.tick);
        this.stateGlobal = new GlobalState();
        this.scene = new Scene(this.stateGlobal, this.platform);
        //this.cameraControls = new CameraControlFree(this.scene.camera, this.platform.control);
    }

    async load(): Promise<void> {
        await this.platform.load();

        if(!this.platform.rwsStructPool.isValidPath()){
            throw new Error('Given Path does not contain Gamefiles');
        }

        await this.scene.setup();
    }

    @bind
    tick(delta: number): void {
        this.platform.control.update(delta);
        this.stateGlobal.update(delta);
        this.scene.update(delta);
    }
}
