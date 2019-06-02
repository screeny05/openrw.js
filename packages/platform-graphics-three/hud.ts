import { IHud } from "@rws/platform/graphic";
import { Scene, OrthographicCamera } from "three";
import { ThreeHudElement } from "./hud-element";

export class ThreeHud implements IHud {
    src: Scene;
    camera: OrthographicCamera;
    $el: HTMLElement;

    constructor(){
        this.$el = document.querySelector('.js--hud') as HTMLDivElement;
        const [width, height] = this.getCanvasSize();

        this.src = new Scene();
        this.camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 30);

        window.addEventListener('resize', this.setCameraFrustum.bind(this));
    }

    setCameraFrustum(){
        const [width, height] = this.getCanvasSize();
        this.camera.left = width / -2;
        this.camera.right = width / 2;
        this.camera.bottom = height / -2;
        this.camera.top = height / 2;
        this.camera.updateProjectionMatrix();
    }

    add(element: ThreeHudElement): void {
        this.src.add(element.src);
    }

    getCanvasSize(): [number, number] {
        const style = window.getComputedStyle(this.$el);
        return [
            Number.parseFloat(style.width ? style.width.replace('px', '') : '0'),
            Number.parseFloat(style.height ? style.height.replace('px', '') : '0')
        ];
    }
}
