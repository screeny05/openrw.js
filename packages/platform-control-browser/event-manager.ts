export class EventManager {
    private listener: [string, EventListenerOrEventListenerObject][] = [];

    constructor(private $el: HTMLElement){}

    add<K extends keyof HTMLElementEventMap>(type: K, fn: EventListenerOrEventListenerObject): void;
    add(type: string, fn: EventListenerOrEventListenerObject): void {
        this.$el.addEventListener(type, fn);
        this.listener.push([type, fn]);
    }

    removeAll(): void {
        this.listener.forEach(([type, fn]) => this.$el.removeEventListener(type, fn));
    }
}
