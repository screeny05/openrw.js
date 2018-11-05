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
import { WebGLRenderer } from '@rws/platform-graphics-three/node_modules/three';
import { ThreeHud } from '@rws/platform-graphics-three/hud';

import './index.scss';

interface FileTxdViewerProps {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

interface FileTxdViewerState {
    isLoaded: boolean;
    pool: RwsStructPool;
    loop: BrowserLoop;
    selectedTexture: ThreeTexture | null;
}

export class FileTxdViewer extends React.Component<FileTxdViewerProps, FileTxdViewerState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    currentRenderer: WebGLRenderer | null = null;

    constructor(props){
        super(props);

        this.canvasRef = React.createRef();

        this.state = {
            isLoaded: false,
            pool: new RwsStructPool(props.index, ThreeTexturePool, ThreeMeshPool, 'american'),
            loop: new BrowserLoop(),
            selectedTexture: null
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

        const entries = this.state.pool.texturePool.getLoadedEntries() as ThreeTexture[];

        this.setState({
            isLoaded: true,
            selectedTexture: entries[0]
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }

        const entries = this.state.pool.texturePool.getLoadedEntries();

        if(entries.length === 0){
            return <div>TXD empty?!</div>;
        }

        return (
            <div>
                <canvas ref={this.canvasRef} className="js--hud" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: this.props.glContainer.width,
                    height: this.props.glContainer.height
                }}/>
                {entries.length > 1 ?
                    <ul className="file-txd-viewer__list">
                        {entries.map(texture =>
                            <li key={texture.name} onClick={this.onSelectTexture.bind(this, texture)}>{texture.name}</li>
                        )}
                    </ul>
                : ''}
                {this.state.selectedTexture ?
                    <div className="file-txd-viewer__info">
                        {this.state.selectedTexture.name + ' '}
                        {`${this.state.selectedTexture.width}x${this.state.selectedTexture.height} `}
                        {this.state.selectedTexture.hasAlpha ? 'alpha' : ''}
                    </div>
                : ''}
            </div>
        );
    }

    componentDidUpdate(){
        if(!this.canvasRef.current || !this.state.selectedTexture){
            return;
        }
        if(!this.currentRenderer){
            this.currentRenderer = new WebGLRenderer({
                antialias: true,
                canvas: this.canvasRef.current,
                alpha: true
            });
        }
        const el = new ThreeHudElement(this.state.selectedTexture);
        const hud = new ThreeHud();
        hud.src.children.splice(0);
        hud.add(el);
        this.currentRenderer.render(hud.src, hud.camera);
    }

    @bind
    onSelectTexture(texture: ThreeTexture): void {
        this.setState({ selectedTexture: texture });
    }
}
