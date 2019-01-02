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
import { RwsTextureNativePlatformIds, RwsTextureNativeRasterFormat, RwsTextureNativeCompression } from '@rws/library/type/rws';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';

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
    rafId: number | null = null;
    hud: ThreeHud;

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
            return <MoleculeLoadingScreen title="Parsing TXD..."/>
        }

        const entries = this.state.pool.texturePool.getLoadedEntries();

        if(entries.length === 0){
            return <div>TXD empty</div>;
        }

        return (
            <div>
                <canvas ref={this.canvasRef} className="js--hud" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                {...{
                    width: this.props.glContainer.width,
                    height: this.props.glContainer.height
                }}/>
                {entries.length > 1 ?
                    <ul className="file-txd-viewer__list">
                        {entries.map(texture =>
                            <li key={texture.name} onClick={this.onSelectTexture.bind(this, texture)}>
                                {texture.name}
                            </li>
                        )}
                    </ul>
                : ''}
                {this.renderTxdInfo()}
            </div>
        );
    }

    renderTxdInfo(): React.ReactFragment {
        if(!this.state.selectedTexture){
            return '';
        }

        const { name, width, height, hasAlpha, format, compression, platform } = this.state.selectedTexture;
        const hasBits = (data: number, mask: number): boolean => (data & mask) === mask;
        let formatString = '';
        const isPal8 = hasBits(format, RwsTextureNativeRasterFormat.PALETTE_8);
        const isPal4 = hasBits(format, RwsTextureNativeRasterFormat.PALETTE_4);
        const isFormat8888 = hasBits(format, RwsTextureNativeRasterFormat.FORMAT_8888);
        const isFormat888 = hasBits(format, RwsTextureNativeRasterFormat.FORMAT_888);
        const usesPalette = (isPal4 || isPal8) && (isFormat888 || isFormat8888);

        if(isFormat8888){
            formatString = '8888 ';
        }
        if(isFormat888){
            formatString = '888 ';
        }
        if(format === RwsTextureNativeRasterFormat.FORMAT_1555){
            formatString = '1555 ';
        }
        if(usesPalette && isPal4){
            formatString += 'PAL4 ';
        }
        if(usesPalette && isPal8){
            formatString += 'PAL8 ';
        }
        if(compression === RwsTextureNativeCompression.DXT1){
            formatString += 'DXT1 ';
        }
        if(compression === RwsTextureNativeCompression.DXT3){
            formatString += 'DXT3 ';
        }

        const mipmapCount = this.state.selectedTexture.src.mipmaps.length;

        const platformString = {
            [RwsTextureNativePlatformIds.PC_3_VC]: 'PC 3/VC',
            [RwsTextureNativePlatformIds.PC_SA]: 'PC SA',
            [RwsTextureNativePlatformIds.PS2]: 'PS2',
            [RwsTextureNativePlatformIds.XBOX]: 'XBOX'
        }[platform];

        return (
            <div className="file-txd-viewer__info">
                {`${name} ${width}x${height} ${hasAlpha ? 'alpha' : ''} ${formatString} ${platformString} ${mipmapCount} Level`}
            </div>
        );
    }

    componentDidUpdate(){
        if(!this.canvasRef.current || !this.state.selectedTexture){
            return;
        }
        const el = new ThreeHudElement(this.state.selectedTexture);
        if(!this.currentRenderer){
            this.hud = new ThreeHud();
            this.hud.$el = this.canvasRef.current;
            this.hud.setCameraFrustum();

            this.currentRenderer = new WebGLRenderer({
                antialias: true,
                canvas: this.canvasRef.current,
                alpha: true
            });
            const render = () => {
                this.currentRenderer.render(this.hud.src, this.hud.camera);
                this.rafId = requestAnimationFrame(render);
            };
            render();
        }
        this.hud.src.children.splice(0);
        this.hud.add(el);
    }

    componentWillUnmount(){
        if(this.rafId){
            cancelAnimationFrame(this.rafId);
        }
    }

    @bind
    onSelectTexture(texture: ThreeTexture): void {
        this.setState({ selectedTexture: texture });
    }
}
