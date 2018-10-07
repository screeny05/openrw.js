import { IHudElement, IHudElementConstructor } from "./hud-element";
import { IHud } from "./hud";
import { ITexture } from "./texture";
import { PlatformAdapter } from "@rws/platform/adapter";
import { IVec2Constructor } from "./vec2";

export class HudCursor {
    hud: IHud;
    platform: PlatformAdapter;
    element: IHudElement;
    textureNormal: ITexture;
    textureWaiting: ITexture;

    HudElement: IHudElementConstructor;
    Vec2: IVec2Constructor;

    constructor(platform: PlatformAdapter, hud: IHud){
        Object.assign(this, platform.graphicConstructors);
        this.platform = platform;
        this.hud = hud;
        this.textureNormal = this.platform.rwsStructPool.texturePool.get('mouse');
        this.textureWaiting = this.platform.rwsStructPool.texturePool.get('mousetimer');
        this.element = new this.HudElement(this.textureNormal);
        this.hud.add(this.element);
    }
}
