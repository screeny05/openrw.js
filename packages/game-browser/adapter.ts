import { PlatformAdapter } from '@rws/platform/adapter';
import { getConfig } from '@rws/platform-config-browser';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { BrowserInput } from 'packages/platform-control-browser';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { ThreeScene } from '@rws/platform-graphics-three/scene';
import { IConstructor } from '@rws/platform/graphic';
import { ThreeVec3 } from '@rws/platform-graphics-three/vec3';
import { ThreeAmbientLight } from '@rws/platform-graphics-three/ambient-light';
import { ThreeSkybox } from '@rws/platform-graphics-three/skybox';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeRenderer } from '@rws/platform-graphics-three/renderer';

export function getGraphicConstructors(): IConstructor {
    return {
        Skybox: ThreeSkybox,
        Scene: ThreeScene,
        AmbientLight: ThreeAmbientLight,
        Vec3: ThreeVec3,
        MeshPool: ThreeMeshPool,
        TexturePool: ThreeTexturePool,
        Renderer: ThreeRenderer
    };
}

export function getBrowserPlatformAdapter(files: FileList, $el: HTMLElement): PlatformAdapter {
    return new PlatformAdapter(
        getConfig(),
        new BrowserFileIndex(files),
        new BrowserInput($el),
        new BrowserLoop(),
        getGraphicConstructors()
    );
}
