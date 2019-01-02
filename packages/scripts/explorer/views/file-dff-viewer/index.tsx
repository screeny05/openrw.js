import * as GoldenLayoutType from 'golden-layout';
import $ from 'jQuery';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { FileComponentProps } from '../..';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { WebGLRenderer, Scene, GridHelper, AmbientLight, Color, PointLight } from '@rws/platform-graphics-three/node_modules/three';
import { ThreeMesh } from '@rws/platform-graphics-three/mesh';
import { BrowserLoop } from '@rws/platform-loop-browser/index';
import { BrowserFile } from '@rws/platform-fs-browser/index';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { CameraControlFree } from '@rws/game/camera-controls-free';
import { ThreeCamera } from '@rws/platform-graphics-three/camera';
import { BrowserInput } from '@rws/platform-control-browser/index';
import { InputControlMapper, defaultMap } from '@rws/platform/control';
import { MeshBasicMaterial, Mesh } from 'three';

export async function FileDffViewer(container: GoldenLayoutType.Container, props: FileComponentProps): Promise<void> {
    const $canvas = $('<canvas>');
    container.getElement().append($canvas);
    $canvas.get(0).tabIndex = 0;

    const pool = new RwsStructPool(props.index, ThreeTexturePool, ThreeMeshPool, 'american');
    await pool.loadImg('models/gta3.img');
    await pool.loadLevelFile('data/default.dat', { ide: true, txd: true });
    await pool.loadLevelFile('data/gta3.dat', { ide: true, txd: true });
    const isTextureLoaded = await pool.definitionPool.loadTextureByDffName(props.node.name.toLowerCase().replace('.dff', ''));

    const mesh = await getMeshFromTreenode(pool, props);
    const scene = new Scene();
    const renderer = new WebGLRenderer({
        antialias: true,
        canvas: $canvas.get(0)
    });
    const camera = new ThreeCamera(75, 0.1, 1000);
    const input = new BrowserInput(container.getElement().get(0));
    const loop = new BrowserLoop();
    const ambient = new AmbientLight(new Color(1, 1, 1));
    const grid = new GridHelper(10, 10);

    grid.rotateX(Math.PI / 2);

    camera.src.up.set(0, 0, 1);
    camera.src.position.set(0, 3, 0);
    camera.src.lookAt(0, 0, 0);

    const setSize = () => {
        $canvas.width(container.width);
        $canvas.height(container.height);
        renderer.setSize(container.width, container.height);
        camera.src.aspect = container.width / container.height;
        camera.src.updateProjectionMatrix();
    };

    container.on('destroy', () => loop.stop());
    container.on('hide', () => loop.stop());
    container.on('show', () => loop.start());
    container.on('resize', setSize);
    setSize();

    if(!isTextureLoaded){
        removeTextureFromMeshMaterials(mesh.src as any);
    }

    scene.add(mesh.src);
    scene.add(ambient);
    scene.add(grid);
    scene.background = new Color(1, 1, 1);

    const camControls = new CameraControlFree(camera, new InputControlMapper(defaultMap, input));

    loop.setTickCallback(delta => {
        camControls.update(delta);
        renderer.render(scene, camera.src);
        input.update(delta);
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

function removeTextureFromMeshMaterials(mesh: Mesh): void {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const materials: MeshBasicMaterial[] = Array.isArray(mesh.material) ? mesh.material as any : [mesh.material];
    materials.forEach(material => {
        material.map = null as any;
        material.needsUpdate = true;
    });

    mesh.children.forEach(child => removeTextureFromMeshMaterials(child as Mesh));
}
