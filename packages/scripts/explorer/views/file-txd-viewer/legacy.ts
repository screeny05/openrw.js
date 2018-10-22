import * as GoldenLayoutType from 'golden-layout';
import $ from 'jQuery';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { FileComponentProps } from '../..';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { WebGLRenderer, Color } from '@rws/platform-graphics-three/node_modules/three';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { ThreeHud } from '@rws/platform-graphics-three/hud';
import { ThreeTexture } from '@rws/platform-graphics-three/texture';
import { ThreeHudElement } from '@rws/platform-graphics-three/hud-element';
import { BrowserLoop } from '@rws/platform-loop-browser';

export async function FileTxdViewer(container: GoldenLayoutType.Container, props: FileComponentProps): Promise<void> {
    const $canvas = $('<canvas class="js--hud">');
    container.getElement().append($canvas);

    const pool = new RwsStructPool(props.index, ThreeTexturePool, ThreeMeshPool, 'american');
    const loop = new BrowserLoop();
    await loadTxdFromTreenode(pool, props);
    const el = new ThreeHudElement(pool.texturePool.getLoadedEntries()[0] as ThreeTexture);
    const renderer = new WebGLRenderer({
        antialias: true,
        canvas: $canvas.get(0),

    });
    const hud = new ThreeHud();

    const setSize = () => {
        $canvas.width(container.width);
        $canvas.height(container.height);
        hud.setCameraFrustum();
        renderer.setSize(container.width, container.height);
        renderer.render(hud.src, hud.camera);
    };

    container.on('resize', setSize);
    setSize();

    loop.setTickCallback(() => renderer.render(hud.src, hud.camera));
    loop.start();

    hud.src.add(el.src);
    hud.src.background = new Color(1, 1, 1);
}

async function loadTxdFromTreenode(pool: RwsStructPool, props: FileComponentProps): Promise<void> {
    const file: BrowserFile|undefined = props.node.data.file;
    const entry: DirEntry|undefined = props.node.data.entry;

    if(file){
        const path = props.node.data.file.path;
        await pool.texturePool.loadFromFile(path);
    }

    if(entry){
        const img: ImgIndex = props.node.data.img;
        const imgPath = props.index.normalizePath(img.imgFile.path);
        pool.imgIndices.set(imgPath, img);
        await pool.texturePool.loadFromImg(imgPath, props.node.name);
    }
}
