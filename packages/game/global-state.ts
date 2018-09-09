export class GlobalState {
    runtime: number = 0;
    gameTime: number = 0;
    gameTimeScale: number = 1;
    weather: number = 0;

    getGameHours(): number {
        return Math.floor(this.gameTime % 24);
    }

    getGameMinutes(): number {
        return Math.floor(this.gameTime * 60) % 60;
    }

    getGameTime(): string {
        return this.getGameHours().toString().padStart(2, '0') + ':' + this.getGameMinutes().toString().padStart(2, '0');
    }

    update(delta: number): void {
        this.runtime += delta;
        this.gameTime += delta / 1000 / 60 * this.gameTimeScale;
    }
}
