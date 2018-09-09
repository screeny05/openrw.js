import { ICameraConstructor } from '@rws/platform/graphic/camera';
import { ISkyboxConstructor } from '@rws/platform/graphic/skybox';
import { ISceneConstructor } from '@rws/platform/graphic/scene';
import { IAmbientLightConstructor } from '@rws/platform/graphic/ambient-light';
import { IVec3Constructor } from '@rws/platform/graphic/vec3';

export interface IConstructor {
    //Camera: ICameraConstructor;
    Skybox: ISkyboxConstructor;
    Scene: ISceneConstructor;
    AmbientLight: IAmbientLightConstructor;
    Vec3: IVec3Constructor;
}
