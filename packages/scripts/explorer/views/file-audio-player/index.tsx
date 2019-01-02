import * as React from 'react';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import { decodeImaAdpcm } from '../../library/decode-ima-adpcm';
import { OrganismAudioPlayer } from '../../components/organism/audio-player';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';

interface FileAudioPlayerProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileAudioPlayerState {
    isLoaded: boolean;
    player?: AudioPlayer;
}

export class AudioPlayer {
    isImaAdpcm: boolean = false;
    ctx: AudioContext;
    src?: AudioBufferSourceNode;
    audioBuffer: AudioBuffer;
    startTime: number = 0;
    isPlaying: boolean = false;
    hasEnded: boolean = true;
    isPaused: boolean = false;
    elapsedAtPause: number = 0;

    onProgressCb?: (elapsed: number) => void;
    onEndedCb?: () => void;

    private progressIntervalId?: NodeJS.Timer;

    constructor(){
        this.ctx = new AudioContext();
    }

    async decode(buffer: ArrayBuffer, isWav: boolean, sdt?: SdtEntry){
        this.src = this.ctx.createBufferSource();

        if(sdt){
            this.audioBuffer = pcmToAudioBuffer(this.ctx, buffer, sdt.samples);
        } else if(isWav){
            try {
                this.audioBuffer = decodeImaAdpcm(this.ctx, buffer);
                this.isImaAdpcm = true;
            } catch(e){}
        }
        if(!this.audioBuffer) {
            this.audioBuffer = await this.ctx.decodeAudioData(buffer);
        }
    }

    get duration(): number {
        return this.audioBuffer.duration;
    }

    get currentElapsed(): number {
        return this.isPlaying ? this.ctx.currentTime - this.startTime : this.elapsedAtPause;
    }

    play(){
        this.src = this.ctx.createBufferSource();
        this.src.buffer = this.audioBuffer;
        this.src.connect(this.ctx.destination);

        if(this.hasEnded){
            this.src.start();
            this.startTime = this.ctx.currentTime;
        } else {
            this.src.start(0, this.currentElapsed);
            this.startTime = this.ctx.currentTime - this.currentElapsed;
        }
        this.hasEnded = false;
        this.isPaused = false;

        this.playbackStarting();
        this.src.addEventListener('ended', () => {
            this.playbackStopping();
            if(!this.isPaused){
                this.hasEnded = true;
            }
        });
    }

    pause(){
        if(!this.src){
            return;
        }
        this.elapsedAtPause = this.currentElapsed;
        this.isPaused = true;

        this.src.stop();
        this.playbackStopping();
    }

    private playbackStarting(){
        this.isPlaying = true;
        this.progressIntervalId = setInterval(() => {
            if(typeof this.onProgressCb !== 'function'){
                return;
            }
            this.onProgressCb(this.currentElapsed);
        }, 100);
    }

    private playbackStopping(){
        this.isPlaying = false;
        if(this.progressIntervalId){
            clearInterval(this.progressIntervalId);
        }
        if(typeof this.onEndedCb === 'function'){
            this.onEndedCb();
        }
    }
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
        const buffer = await treeviewnodeToBuffer(this.props.node);
        this.setState({ isLoaded: true });
        if(!buffer){
            return;
        }
        const player = new AudioPlayer();
        await player.decode(buffer, this.props.node.name.toLowerCase().endsWith('.wav'), this.props.node.data.sdt);
        this.setState({ player });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Loading Buffer..."/>
        }
        if(!this.state.player){
            return <MoleculeLoadingScreen title="Decoding Buffer..."/>
        }

        const fileExtensionMatch = this.props.node.name.match(/\.(.*)$/);
        let audioFormat = 'Unknown';

        if(fileExtensionMatch){
            audioFormat = fileExtensionMatch[1].toUpperCase();
        }
        if(this.state.player.isImaAdpcm){
            audioFormat = 'IMA-ADPCM';
        }
        if(this.props.node.data.sdt){
            audioFormat = 'PCM (from SDT)';
        }

        return (
            <div>
                <OrganismAudioPlayer player={this.state.player} autoplay/>
                {audioFormat}
                {', ' + this.state.player.audioBuffer.numberOfChannels + ' '}
                Channel{this.state.player.audioBuffer.numberOfChannels > 1 ? 's' : ''}
            </div>
        );
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
