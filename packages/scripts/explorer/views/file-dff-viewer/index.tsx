import * as GoldenLayoutType from 'golden-layout';
import $ from 'jQuery';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { FileComponentProps } from '../..';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, Color } from '@rws/platform-graphics-three/node_modules/three';
import { ThreeMesh } from '@rws/platform-graphics-three/mesh';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';

export async function FileDffViewer(container: GoldenLayoutType.Container, props: FileComponentProps): Promise<void> {
    const $canvas = $('<canvas>');
    container.getElement().append($canvas);

    const pool = new RwsStructPool(props.index, ThreeTexturePool, ThreeMeshPool, 'american');
    const mesh = await getMeshFromTreenode(pool, props);
    const scene = new Scene();
    const renderer = new WebGLRenderer({
        antialias: true,
        canvas: $canvas.get(0)
    });
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    const loop = new BrowserLoop();
    const ambient = new AmbientLight(new Color(1, 1, 1));

    camera.up.set(0, 0, 1);
    camera.position.set(0, 3, 0);
    camera.lookAt(0, 0, 0);

    const setSize = () => {
        $canvas.width(container.width);
        $canvas.height(container.height);
        renderer.setSize(container.width, container.height);
        camera.aspect = container.width / container.height;
    };

    container.on('destroy', () => loop.stop());
    container.on('resize', () => setSize);
    setSize();

    scene.add(mesh.src);
    scene.add(ambient);
    scene.background = new Color(1, 1, 1);

    loop.setTickCallback(() => {
        renderer.render(scene, camera);
    });
    loop.start();
}


async function getMeshFromTreenode(pool: RwsStructPool, props: FileComponentProps): Promise<ThreeMesh> {
    const file: BrowserFile|undefined = props.node.data.file;
    const entry: DirEntry|undefined = props.node.data.entry;

    if(file){
        const path = props.node.data.file.path;
        const gxtPath = props.index.normalizePath(path.replace(/\.dff$/i, ''));

        await pool.meshPool.loadFromFile(path);
        return pool.meshPool.get(gxtPath) as ThreeMesh;
    }

    if(entry){
        const img: ImgIndex = props.node.data.img;
        const imgPath = props.index.normalizePath(img.imgFile.path);
        pool.imgIndices.set(imgPath, img);
        await pool.meshPool.loadFromImg(imgPath, props.node.name);
        return pool.meshPool.get(props.node.name.replace(/\.dff$/i, '')) as ThreeMesh;
    }

    throw new Error('Cannot load mesh from treenode');
}
