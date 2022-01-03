import 'setimmediate';
import 'regenerator-runtime/runtime';
import { BrowserFileIndex } from '@rws/platform-fs-browser';
import { Renderer } from './renderer';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { TexturePool } from './texture-pool';
import { MeshPool } from './mesh-pool';
import { Texture } from './texture';

const $select = <HTMLInputElement>document.querySelector('.js--folder-select');
const $canvas = <HTMLCanvasElement>document.querySelector('.js--canvas');

const setupPlatform = async () => {
    if(!$select.files){
        return;
    }

    document.documentElement.classList.add('is--running');

    const files = new BrowserFileIndex($select.files);
    await files.load();

    const renderer = new Renderer($canvas);

    const rwsPool = new RwsStructPool(files, TexturePool, MeshPool);
    const texturePool = rwsPool.texturePool as TexturePool;
    texturePool.init(renderer.gl);

    await texturePool.loadFromFile('models/generic.txd');
    const texture = rwsPool.texturePool.get('pavedark128');
    console.log(texture);

    renderer.texture = texture as Texture;

    renderer.render(0);
};

const render = () => {
    document.documentElement.classList.add('is--running');

    const renderer = new Renderer($canvas);
    renderer.render(0);
}

$select.addEventListener('change', setupPlatform);

//render();
