import 'setimmediate';
import '../rwscore/parser-bin';

import { PlatformFileIndex } from './platform/file-index';
import RwsStructPool from '../rwscore/rws-struct-pool';
import { Render } from './render';

const $select: HTMLInputElement = <any>document.querySelector('.js--folder-select');

$select.addEventListener('change', async () => {
    const fileIndex = new PlatformFileIndex($select);
    const rwsPool = new RwsStructPool(fileIndex);

    // is it a game directory?
    if(!rwsPool.isValidPath()){
        $select.value = '';
        return;
    }

    $select.remove();
    await rwsPool.load();
    console.log(rwsPool);
    new Render(rwsPool);
});

/*
import Config from './rwsgame/config';

require('./rwslib/parsers');

const config = new Config();
const game = new Game(config);

(async () => {
    await game.init();
    game.start();
})();*/
