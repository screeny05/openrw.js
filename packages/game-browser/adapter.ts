import { PlatformAdapter } from '@rws/platform/adapter';
import { getConfig } from '@rws/platform-config-browser';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { BrowserInput } from '@rws/platform-control-browser';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { BrowserConstructor } from '@rws/platform-graphics-three/constructor';

export function getBrowserPlatformAdapter(files: FileList, $el: HTMLElement): PlatformAdapter {
    return new PlatformAdapter(
        getConfig(),
        new BrowserFileIndex(files),
        new BrowserInput($el),
        new BrowserLoop(),
        BrowserConstructor
    );
}
