import Game from '../rwsgame/game';
import Config from '../rwsgame/config';
import CLI from './cli';

require('../rwslib/parsers');

const config = new Config();
const game = new Game(config);
const cli = new CLI(game);

(async () => {
    await game.init();
    game.start();
})();
