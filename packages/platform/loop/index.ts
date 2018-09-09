export type TickCallback = (delta: number) => void;

export interface ILoop {
    isRunning: boolean;
    start(): void;
    stop(): void;
    setTickCallback(fn: TickCallback): void;
}
