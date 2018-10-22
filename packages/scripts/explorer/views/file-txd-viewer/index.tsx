import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { BrowserFile } from '@rws/platform-fs-browser/';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import bind from 'bind-decorator';
import { BrowserLoop } from '@rws/platform-loop-browser/';
import { ThreeHudElement } from '@rws/platform-graphics-three/hud-element';
import { ThreeTexture } from '@rws/platform-graphics-three/texture';
import { WebGLRenderer } from 'three';

interface FileTxdViewerProps {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
}

interface FileTxdViewerState {
    isLoaded: boolean;
    pool: RwsStructPool;
    loop: BrowserLoop;
    selectedIndex: number;
}

export class FileTxdViewer extends React.Component<FileTxdViewerProps, FileTxdViewerState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props){
        super(props);

        this.canvasRef = React.createRef();

        this.state = {
            isLoaded: false,
            pool: new RwsStructPool(props.index, ThreeTexturePool, ThreeMeshPool, 'american'),
            loop: new BrowserLoop(),
            selectedIndex: 0
        };

        this.init();
    }

    async init(){
        const file: BrowserFile|undefined = this.props.node.data.file;
        const entry: DirEntry|undefined = this.props.node.data.entry;

        if(file){
            const path = this.props.node.data.file.path;
            await this.state.pool.texturePool.loadFromFile(path);
        }

        if(entry){
            const img: ImgIndex = this.props.node.data.img;
            const imgPath = this.props.index.normalizePath(img.imgFile.path);
            this.state.pool.imgIndices.set(imgPath, img);
            await this.state.pool.texturePool.loadFromImg(imgPath, this.props.node.name);
        }

        this.setState({ isLoaded: true });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }

        return (
            <div>
                <ul>
                    {this.state.pool.texturePool.getLoadedEntries().map(texture =>
                        <li onClick={this.onSelectTexture}>{texture.name}</li>
                    )}
                </ul>
                <canvas ref={this.canvasRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
            </div>
        );
    }

    componentDidUpdate(){
        if(!this.canvasRef.current){
            return;
        }
    }

    @bind
    onSelectTexture(e): void {
        console.log(e)

        const el = new ThreeHudElement(this.state.pool.texturePool.getLoadedEntries()[this.state.selectedIndex] as ThreeTexture);
        const renderer = new WebGLRenderer({
            antialias: true,
            canvas: $canvas.get(0),
        });
        const hud = new ThreeHud();
    }
}
