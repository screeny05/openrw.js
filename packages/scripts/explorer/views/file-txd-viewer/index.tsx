import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { BrowserFile } from '@rws/platform-fs-browser';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import bind from 'bind-decorator';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { ThreeHudElement } from '@rws/platform-graphics-three/hud-element';
import { ThreeTexture } from '@rws/platform-graphics-three/texture';
import { ThreeHud } from '@rws/platform-graphics-three/hud';

import './index.scss';
import { RwsTextureNativePlatformIds, RwsTextureNativeRasterFormat, RwsTextureNativeCompression } from '@rws/library/type/rws';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import { AtomThreeCanvas } from '../../components/atom/three-canvas';
import { BrowserInput } from '@rws/platform-control-browser';
import { OrthographicCamera, WebGLRenderer, Scene } from 'three';
import { MoleculeSelectList } from '../../components/molecule/select-list';

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
    hud: Scene;

    constructor(props){
        super(props);

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
            <div className='checkered-background'>
                <AtomThreeCanvas glContainer={this.props.glContainer} camera='orthographic' tickCallback={this.onTick} className='js--hud' alpha/>
                {entries.length > 1 ?
                    <div style={{ position: 'relative', zIndex: 1, width: 200 }}>
                        <MoleculeSelectList heightAdd={-44} glContainer={this.props.glContainer} items={entries} onSelect={this.onSelectTexture}/>
                    </div>
                : ''}
                {this.renderTxdInfo()}
            </div>
        );
    }

    @bind
    onTick(delta: number, renderer: WebGLRenderer, input?: BrowserInput, camera?: OrthographicCamera): void {
        if(!camera || !this.state.selectedTexture){
            return;
        }

        if(!this.hud){
            this.hud = new Scene();
        }

        renderer.setClearColor(0, 0);
        renderer.render(this.hud, camera);
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

    @bind
    onSelectTexture(texture: ThreeTexture): void {
        this.hud.children.splice(0);
        const element = new ThreeHudElement(texture);
        this.hud.add(element.src as any);
        this.setState({ selectedTexture: texture });
        console.log(this);
    }
}
