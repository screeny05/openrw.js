import { IHud } from "@rws/platform/graphic";
import { Scene, OrthographicCamera, Color } from "three";
import { ThreeHudElement } from "./hud-element";

export class ThreeHud implements IHud {
    src: Scene;
    camera: OrthographicCamera;
    $el: HTMLElement;

    constructor(){
        this.$el = document.querySelector('.js--hud') as HTMLDivElement;
        const width = this.$el.clientWidth;
        const height = this.$el.clientHeight;

        this.src = new Scene();
        this.camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 30);

        window.addEventListener('resize', this.setCameraFrustum.bind(this));
    }

    setCameraFrustum(){
        const width = this.$el.clientWidth;
        const height = this.$el.clientHeight;
        this.camera.left = width / -2;
        this.camera.right = width / 2;
        this.camera.top = height / -2;
        this.camera.bottom = height / 2;
        this.camera.updateProjectionMatrix();
    }

    add(element: ThreeHudElement): void {
        this.src.add(element.src);
    }
}
