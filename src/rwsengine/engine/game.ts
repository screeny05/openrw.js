import GameData from './game-data';

export default class Game {
    config;
    gameData: GameData;

    constructor(config){
        this.gameData = new GameData(config.paths.base);

        this.gameData.init();
    }
}
