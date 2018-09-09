import { ILoop, TickCallback } from "@rws/platform/loop";

export class BrowserLoop implements ILoop {
    isRunning: boolean = false;
    callback: TickCallback;

    private lastTime = 0;

    start(): void {
        if(typeof this.callback !== 'function'){
            throw new Error('Loop callback has to be set before running.');
        }

        this.lastTime = 0;
        this.isRunning = true;
        this.requestTick();
    }

    stop(): void {
        this.isRunning = false;
    }

    setTickCallback(fn: TickCallback): void {
        this.callback = fn;
    }

    requestTick(): void {
        if(!this.isRunning){
            return;
        }
        requestAnimationFrame(time => {
            const delta = time - this.lastTime;
            this.lastTime = time;
            this.callback(delta);
            this.requestTick();
        });
    }
}
