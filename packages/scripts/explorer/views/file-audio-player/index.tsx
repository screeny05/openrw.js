import * as React from 'react';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import { decodeImaAdpcm } from '../../library/decode-ima-adpcm';
import WaveFile from 'wavefile/dist/wavefile.umd.js';

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
            try {
                data = decodeImaAdpcm(ctx, this.state.buffer);
            } catch(e){}
        }
        if(sdt){
            data = pcmToAudioBuffer(ctx, this.state.buffer, sdt.samples);
        } else if(!data) {
            data = await ctx.decodeAudioData(this.state.buffer);
        }
        const src = ctx.createBufferSource();
        src.buffer = data;
        src.connect(ctx.destination);
        src.start();
    }
}

const pcmToAudioBuffer = (ctx: AudioContext, buffer: ArrayBuffer, sampleRate: number): AudioBuffer => {
    const MAX_INT16 = 32767;
    const pcm = new Int16Array(buffer);
    const target = ctx.createBuffer(1, pcm.length, sampleRate);
    const targetData = target.getChannelData(0);
    pcm.forEach((s, i) => targetData[i] = s / MAX_INT16);
    return target;
};
