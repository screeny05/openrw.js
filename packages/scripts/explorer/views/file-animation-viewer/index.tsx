import * as React from 'react';
import Corrode from '@rws/library/node_modules/corrode';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { IfpAnpk } from '@rws/library/parser-bin/ifp';
import { ImgIndex } from '@rws/library/index/img';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { IfpTAnimation } from '@rws/library/parser-bin/ifp/anim';
import { AtomThreeCanvas } from '../../components/atom/three-canvas';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import { MoleculeSelectList } from '../../components/molecule/select-list';
import bind from 'bind-decorator';

interface State {
    isLoaded: boolean;
    ifp?: IfpAnpk;
    currentAnimation?: IfpTAnimation;
}

interface Props {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

export class FileAnimationViewer extends React.Component<Props, State> {
    state: State = {
        isLoaded: false,
    }

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        const file: BrowserFile|undefined = this.props.node.data.file;
        const entry: DirEntry|undefined = this.props.node.data.entry;
        const parser = new Corrode().ext.ifp('ifp').map.push('ifp');
        let ifp: IfpAnpk|undefined;

        if(file){
            ifp = await file.parse<IfpAnpk>(parser)
        }
        if(entry){
            const img: ImgIndex = this.props.node.data.img;
            ifp = await img.imgFile.parse<IfpAnpk>(parser, entry.offset, entry.offset + entry.size)
        }

        const pool = new RwsStructPool(this.props.index, ThreeTexturePool, ThreeMeshPool, 'american');
        await pool.loadImg('models/gta3.img');
        await pool.loadLevelFile('data/default.dat', { ide: true, txd: true });
        await pool.loadLevelFile('data/gta3.dat', { ide: true, txd: true });

        this.setState({
            isLoaded: true,
            currentAnimation: ifp ? ifp.entries[0] : undefined,
            ifp
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Parsing IFP..."/>
        }
        if(!this.state.ifp){
            return <div>unable to parse ifp</div>;
        }

        return (
            <div>
                <AtomThreeCanvas glContainer={this.props.glContainer} tickCallback={this.onTick}/>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {this.state.ifp.name + ' - '}
                    {this.state.currentAnimation ? this.state.currentAnimation.name : ''}
                    <MoleculeSelectList width={200} heightAdd={-30} glContainer={this.props.glContainer} items={this.state.ifp.entries} onSelect={item => this.setState({ currentAnimation: item as IfpTAnimation })}/>
                </div>
            </div>
        );
    }

    @bind
    onTick(): void {
    }
}
