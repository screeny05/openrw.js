import { PlatformAdapter } from '@rws/platform/adapter';
import { getConfig } from '@rws/platform-config-browser';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { BrowserInput } from 'packages/platform-control-browser';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { ThreeMeshProvider } from '@rws/platform-graphics-three/mesh-provider';
import { ThreeScene } from '@rws/platform-graphics-three/scene';
import { IConstructor } from '@rws/platform/graphic';
import { ThreeVec3 } from '@rws/platform-graphics-three/Vec3';
import { ThreeAmbientLight } from '@rws/platform-graphics-three/ambient-light';

export function getGraphicConstructors(): IConstructor {
    return {
        Scene: ThreeScene,
        AmbientLight: ThreeAmbientLight,
        Vec3: ThreeVec3
    };
}

export function getBrowserPlatformAdapter(files: FileList, $el: HTMLElement): PlatformAdapter {
    return new PlatformAdapter(
        getConfig(),
        new BrowserFileIndex(files),
        new BrowserInput($el),
        new BrowserLoop(),
        new ThreeMeshProvider(),
        getGraphicConstructors()
    );
}
