import Config from './config';
import GameData from './game-data';
import GameWorld from 'rwsnative/game-world';

import { NativeWindow } from '@glaced/lwngl';
import { GLES2Context, glContext } from '@glaced/gles2-2.0';
import { getGlDebugProxy } from '../rwsengine/gl-debug';
import Renderer from '../rwsengine/renderer';
import Camera from '../rwsengine/camera';
import CameraControlsOrbital from '../rwsengine/camera-controls-orbital';
import Input from '../rwsengine/input';

import bind from 'bind-decorator';
import { EventEmitter } from 'events';

export default class Game extends EventEmitter {
    config: Config;
    data: GameData;
    world: GameWorld;

    window: NativeWindow<GLES2Context>;
    renderer: Renderer;
    input: Input;
    camera: Camera;
    cameraControls: CameraControlsOrbital;

    isRunning: boolean = false;
    lastTime: number = 0;
    framesCount: number = 0;
    framesMeasureCount: number = 0;

    timeoutMeasureFps: number;

    constructor(config: Config){
        super();
        this.config = config;

        let context = glContext;
        if(this.config.debugGl){
            context = getGlDebugProxy(glContext, {
                enableLogging: false,
                sanityCheck: true
            });
        }

        this.window = new NativeWindow<GLES2Context>({
            title: `${this.config.packageName} ${this.config.packageVersion} (${this.config.packageRevShort})`,
            context
        });

        this.data = new GameData(this.config);
        this.world = new GameWorld(this.data, this.window.context);

        this.input = new Input(this.window);
        this.camera = new Camera(Math.PI / 180 * this.config.fov, this.window);
        this.cameraControls = new CameraControlsOrbital(this.input, this.camera);
        this.renderer = new Renderer(this.window, this.camera, this.world);

        this.window.on('close', this.onWindowClose);
    }

    async init(){
        await this.data.init();
        await this.world.init();
        this.emit('init');
    }

    @bind
    onWindowClose(){
        clearTimeout(this.timeoutMeasureFps);
    }

    start(){
        this.isRunning = true;
        this.tick();
        this.measureFps();
    }

    @bind
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

    @bind
    measureFps(){
        this.emit('fps', this.framesCount, this.framesMeasureCount);
        this.framesMeasureCount++;
        this.framesCount = 0;
        this.timeoutMeasureFps = setTimeout(this.measureFps, 1000);
    }
}
