import Config from './config';
import GameData from './game-data';


import NativeWindow from '../rwsengine/native-window';
import Renderer from '../rwsengine/renderer';
import Camera from '../rwsengine/camera';
import CameraControlsOrbit from '../rwsengine/camera-controls-orbital';
import Input from '../rwsengine/input';

import { Bind } from 'lodash-decorators';

export default class Game {
    config: Config;
    gameData: GameData;

    window: NativeWindow;
    renderer: Renderer;
    input: Input;
    camera: Camera;
    cameraControls: CameraControlsOrbit;

    isRunning: boolean = false;
    lastTime: number = 0;
    framesCount: number = 0;

    constructor(config: Config){
        this.config = config;
        this.gameData = new GameData(this.config);

        this.window = new NativeWindow({
            title: `${this.config.packageName} ${this.config.packageVersion} (${this.config.packageRevShort})`
        });

        this.input = new Input(this.window);
        this.camera = new Camera(Math.PI / 180 * 60, this.window);
        this.cameraControls = new CameraControlsOrbit(this.input, this.camera);
        this.renderer = new Renderer(this.window, this.camera);
    }

    async init(){
        await this.gameData.init();

        //this.renderer.geometries.push()
    }

    start(){
        this.isRunning = true;
        this.tick();
        this.measureFps();
    }

    @Bind()
    tick(currentTime: number = 0){
        const delta = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.framesCount++;

        this.input.update(delta);
        this.cameraControls.update(delta);

        this.renderer.render();

        if(this.isRunning){
            this.window.requestAnimationFrame(this.tick);
        }
    }

    @Bind()
    measureFps(){
        console.log(`${this.framesCount}fps`);
        this.framesCount = 0;
        setTimeout(this.measureFps, 1000);
    }
}
