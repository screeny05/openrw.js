import 'setimmediate';
import "regenerator-runtime/runtime";
import { getBrowserPlatformAdapter } from '@rws/game-browser/adapter';
import { Game } from '@rws/game/index';

const $select = <HTMLInputElement>document.querySelector('.js--folder-select');
const $reload = <HTMLButtonElement>document.querySelector('.js--reload');

let game: Game | null = null;

const setupPlatform = async () => {
    if(!$select.files){
        return;
    }

    $select.style.display = 'none';
    const adapter = getBrowserPlatformAdapter($select.files, document.documentElement);
    game = new Game(adapter);
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
