import * as webgl from 'node-webgl';

interface Options {
    width: number;
    height: number;
    title: string;
}

export default class NativeWindow {
    static defaults: Options = {
        width: 800,
        height: 600,
        title: ''
    };

    gl: WebGLRenderingContext;
    document: Document;
    documentAny: any;
    canvas: HTMLCanvasElement;
    Image: HTMLImageElement;
    requestAnimationFrame: Function;

    options: Options;

    constructor(options){
        this.options = { ...NativeWindow.defaults, ...options };

        this.documentAny = webgl.document();
        this.document = this.documentAny;

        this.requestAnimationFrame = this.documentAny.requestAnimationFrame;

        this.canvas = this.documentAny.createElement('canvas', this.options.width, this.options.height);

        this.documentAny.setTitle(this.options.title);

        this.gl = this.canvas.getContext("webgl");
        this.Image = webgl.Image;
    }

    get ratio(): number {
        return this.documentAny.ratio;
    }

    get width(): number {
        return this.documentAny.width;
    }

    get height(): number {
        return this.documentAny.height;
    }
}
