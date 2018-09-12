import { IConstructor } from "@rws/platform/graphic";
import { ThreeScene } from "./scene";
import { ThreeAmbientLight } from "./ambient-light";
import { ThreeVec3 } from "./vec3";
import { ThreeSkybox } from "./skybox";
import { ThreeTexturePool } from "./texture-pool";
import { ThreeRenderer } from "./renderer";
import { ThreeCamera } from "./camera";
import { ThreeMeshPool } from "@rws/platform-graphics-three/mesh-pool";

export const BrowserConstructor: IConstructor = {
    Skybox: ThreeSkybox,
    Scene: ThreeScene,
    AmbientLight: ThreeAmbientLight,
    Vec3: ThreeVec3,
    TexturePool: ThreeTexturePool,
    MeshPool: ThreeMeshPool,
    Renderer: ThreeRenderer,
    Camera: ThreeCamera,
}
