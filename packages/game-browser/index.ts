import 'setimmediate';
import "regenerator-runtime/runtime";
import { getBrowserPlatformAdapter } from './adapter';
import { Game } from '@rws/game';
import * as THREE from 'three';

window.THREE = THREE;

const $select = <HTMLInputElement>document.querySelector('.js--folder-select');
const $reload = <HTMLButtonElement>document.querySelector('.js--reload');
const $canvas = <HTMLCanvasElement>document.querySelector('.js--canvas');

let game: Game | null = null;

const setupPlatform = async () => {
    if(!$select.files){
        return;
    }

    $select.style.display = 'none';
    const adapter = getBrowserPlatformAdapter($select.files, $canvas);
    game = new Game(adapter);
    await game.load();
    game.platform.loop.start();
};

$select.addEventListener('change', setupPlatform);

$reload.addEventListener('click', () => {
    if(game){
        game.platform.loop.stop();
        //game.renderer.renderer.domElement.remove();
    }
    setupPlatform();
});
