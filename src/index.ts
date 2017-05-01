import Game from './rwsgame/game';
import Config from './rwsgame/config';

require('./rwslib/parsers');

const config = new Config();
const game = new Game(config);

(async () => {
    await game.init();
    game.start();
})();
