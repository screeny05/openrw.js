import * as webgl from 'node-webgl';
import * as GLFW from 'node-glfw';

import Input from './input';

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
    document: any;
    handle: number;
    Image: HTMLImageElement;
    requestAnimationFrame: Function;

    options: Options;

    input: Input;

    constructor(options){
        this.options = { ...NativeWindow.defaults, ...options };

        this.document = webgl.document();

        this.requestAnimationFrame = this.document.requestAnimationFrame;

        this.handle = this.document.createWindow(this.options.width, this.options.height);

        this.document.setTitle(this.options.title);

        this.gl = this.document.getContext("webgl");
        this.Image = webgl.Image;
    }

    getSize() {
        return GLFW.GetWindowSize(this.handle);
    }

    get ratio(): number {
        return this.document.ratio;
    }

    get width(): number {
        return this.document.width;
    }

    get height(): number {
        return this.document.height;
    }

    get on(): Function {
        return this.document.addEventListener;
    }
}
