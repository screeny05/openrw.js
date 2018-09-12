import { ISkyboxConstructor } from './skybox';
import { ISceneConstructor } from './scene';
import { IAmbientLightConstructor } from './ambient-light';
import { IVec3Constructor } from './vec3';
import { ITexturePoolConstructor } from './texture-pool';
import { IMeshPoolConstructor } from './mesh-pool';
import { IRendererConstructor } from './renderer';
import { ICameraConstructor } from './camera';

export interface IConstructor {
    Camera: ICameraConstructor;
    Skybox: ISkyboxConstructor;
    Scene: ISceneConstructor;
    AmbientLight: IAmbientLightConstructor;
    Vec3: IVec3Constructor;
    TexturePool: ITexturePoolConstructor;
    MeshPool: IMeshPoolConstructor;
    Renderer: IRendererConstructor;
}
