import { IConstructor } from "@rws/platform/graphic";
import { ThreeScene } from "./scene";
import { ThreeAmbientLight } from "./ambient-light";
import { ThreeVec3 } from "./vec3";
import { ThreeVec2 } from "./vec2";
import { ThreeSkybox } from "./skybox";
import { ThreeTexturePool } from "./texture-pool";
import { ThreeRenderer } from "./renderer";
import { ThreeCamera } from "./camera";
import { ThreeMeshPool } from "./mesh-pool";
import { ThreeHud } from "./hud";
import { ThreeHudElement } from "./hud-element";

export const BrowserConstructor: IConstructor = {
    Skybox: ThreeSkybox,
    Scene: ThreeScene,
    AmbientLight: ThreeAmbientLight,
    Vec3: ThreeVec3,
    Vec2: ThreeVec2,
    TexturePool: ThreeTexturePool,
    MeshPool: ThreeMeshPool,
    Renderer: ThreeRenderer,
    Camera: ThreeCamera,
    Hud: ThreeHud,
    HudElement: ThreeHudElement
}
