import GameData from './game-data';

export default class Game {
    config;
    gameData: GameData;

    constructor(config){
        this.gameData = new GameData(config.paths.base);
    }

    async init(){
        await this.gameData.init();
        console.log(this.gameData);
    }
}
