import * as React from 'react';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import WaveFile from 'wavefile/dist/wavefile.umd.js';
console.log(WaveFile);

interface FileAudioPlayerProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileAudioPlayerState {
    isLoaded: boolean;
    buffer?: ArrayBuffer;
}

export class FileAudioPlayer extends React.Component<FileAudioPlayerProps, FileAudioPlayerState> {
    state: FileAudioPlayerState = {
        isLoaded: false
    }

    playing: boolean = false;

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        this.setState({
            isLoaded: true,
            buffer: await treeviewnodeToBuffer(this.props.node)
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading</div>;
        }
        if(!this.state.buffer){
            return <div>unable to load</div>;
        }

        return (
            <div>
                <h1>rwexplorer</h1>
            </div>
        );
    }

    componentDidUpdate(){
        if(!this.playing){
            this.play();
        }
    }

    async play(){
        if(!this.state.buffer){
            return;
        }

        this.playing = true;

        const sdt: SdtEntry | null = this.props.node.data.sdtEntry;
        const ctx = new AudioContext();
        let data: AudioBuffer | null = null;

        if(this.props.node.name.toLowerCase().endsWith('.wav')){
            const x = new WaveFile(new Uint8Array(this.state.buffer));
            // only decode imaadpcm
            if(x.fmt.audioFormat === 17){
                x.fromIMAADPCM();
                data = await ctx.decodeAudioData(x.toBuffer().buffer as ArrayBuffer);
            }
        }

        if(sdt){
            data = ctx.createBuffer(1, 0, sdt.samples);
            const floats = data.getChannelData(0);
            new Uint8Array(this.state.buffer).forEach((val, i) => floats[i] = val);

            console.log(sdt.size, this.state.buffer.byteLength, data);
        } else if(!data) {
            data = await ctx.decodeAudioData(this.state.buffer);
        }
        console.log(data)
        const src = ctx.createBufferSource();
        src.buffer = data;
        src.connect(ctx.destination);
        src.start();
    }
}
