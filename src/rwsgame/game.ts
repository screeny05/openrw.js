import Config from './config';
import GameData from './game-data';
import GameWorld from './game-world';


import { NativeWindow } from 'node-gles3';
import Renderer from '../rwsengine/renderer';
import Camera from '../rwsengine/camera';
import CameraControlsOrbit from '../rwsengine/camera-controls-orbital';
import Input from '../rwsengine/input';

import { Bind } from 'lodash-decorators';

export default class Game {
    config: Config;
    data: GameData;
    world: GameWorld;

    window: NativeWindow;
    renderer: Renderer;
    input: Input;
    camera: Camera;
    cameraControls: CameraControlsOrbit;

    isRunning: boolean = false;
    lastTime: number = 0;
    framesCount: number = 0;

    timeoutMeasureFps: NodeJS.Timer;

    constructor(config: Config){
        this.config = config;

        this.window = new NativeWindow({
            title: `${this.config.packageName} ${this.config.packageVersion} (${this.config.packageRevShort})`
        });

        this.data = new GameData(this.config);
        this.world = new GameWorld(this.data, this.window.gl);

        this.input = new Input(this.window);
        this.camera = new Camera(Math.PI / 180 * 60, this.window);
        this.cameraControls = new CameraControlsOrbit(this.input, this.camera);
        this.renderer = new Renderer(this.window, this.camera, this.world);

        this.window.on('close', this.onWindowClose);
    }

    async init(){
        await this.data.init();
        await this.world.init();
    }

    @Bind()
    onWindowClose(){
        clearTimeout(this.timeoutMeasureFps);
    }

    start(){
        this.isRunning = true;
        this.tick();
        this.measureFps();
    }

    @Bind()
    tick(currentTime: number = 0){
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.framesCount++;

        this.input.update(delta);
        this.cameraControls.update(delta);

        this.renderer.render();

        if(this.isRunning){
            this.window.requestFrame(this.tick);
        }
    }

    @Bind()
    measureFps(){
        console.log(`${this.framesCount}fps`);
        this.framesCount = 0;
        this.timeoutMeasureFps = setTimeout(this.measureFps, 1000);
    }
}
