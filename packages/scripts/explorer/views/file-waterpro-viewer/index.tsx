import * as React from 'react';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import Corrode from '@rws/library/node_modules/corrode';
import { BrowserFile } from '@rws/platform-fs-browser/';
import { Waterpro } from '@rws/library/type/waterpro';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';

interface FileWaterproViewerProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileWaterproViewerState {
    isLoaded: boolean;
    data?: Waterpro;
    isSelectedSmall: boolean;
}

export class FileWaterproViewer extends React.Component<FileWaterproViewerProps, FileWaterproViewerState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    rafId: number | null = null;
    ctx: CanvasRenderingContext2D | null = null;

    state: FileWaterproViewerState = {
        isLoaded: false,
        isSelectedSmall: false
    }

    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.init();
    }

    async init(){
        const parser = new Corrode().ext.waterpro('waterpro').map.push('waterpro');
        const file: BrowserFile = this.props.node.data.file;

        this.setState({
            isLoaded: true,
            data: await file.parse(parser)
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Parsing waterpro.dat"/>
        }
        if(!this.state.data){
            return <div>unable to load</div>;
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
                <ul style={{
                    position: 'absolute',
                    top: 140
                }}>
                    <li onClick={() => this.setState({ isSelectedSmall: true })}>Visible</li>
                    <li onClick={() => this.setState({ isSelectedSmall: false })}>Physical</li>
                </ul>
            </div>
        );
    }

    componentDidUpdate(){
        if(!this.canvasRef.current || !this.state.data){
            return;
        }
        if(!this.ctx){
            this.ctx = this.canvasRef.current.getContext('2d');
        }
        if(!this.ctx){
            return;
        }
        const { ctx } = this;

        const BITMAP_SIZE_PHYSICAL = 128;
        const BITMAP_SIZE_VISIBLE = 64;
        const src = this.state.isSelectedSmall ? this.state.data.visibleLevels : this.state.data.physicalLevels;
        const bitmapSize = this.state.isSelectedSmall ? BITMAP_SIZE_VISIBLE : BITMAP_SIZE_PHYSICAL;

        ctx.clearRect(0, 0, BITMAP_SIZE_PHYSICAL, BITMAP_SIZE_PHYSICAL);

        src.forEach((level, i) => {
            level = typeof level === 'undefined' ? 255 : level;
            ctx.fillStyle = `rgb(${level}, ${level}, ${level})`;
            ctx.fillRect(Math.floor(i / bitmapSize), i % bitmapSize, 1, 1);
        });
    }

    componentWillUnmount(){
        if(this.rafId){
            cancelAnimationFrame(this.rafId);
        }
    }
}
