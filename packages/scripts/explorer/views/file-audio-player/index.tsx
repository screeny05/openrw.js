import * as React from 'react';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import { decodeImaAdpcm } from '../../library/decode-ima-adpcm';
import { OrganismAudioPlayer } from '../../components/organism/audio-player';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import { clamp } from '../../library/math';
import bind from 'bind-decorator';

interface FileAudioPlayerProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileAudioPlayerState {
    isLoaded: boolean;
    player?: BrowserAudioPlayer;
    controls?: AudioControls;
}

interface IAudioPlayer {
    duration: number;
    currentPosition: number;
    isPlaying: boolean;
    start(at?: number): void;
    stop(): void;
    sendCurrentPosition(): void;
    onProgress?: (currentPosition: number) => void;
    onStopped?: () => void;
}

class BrowserAudioPlayer implements IAudioPlayer {
    meta = { isImaAdpcm: false };
    ctx: AudioContext = new AudioContext();
    src?: AudioBufferSourceNode;
    audioBuffer: AudioBuffer;
    startTime: number = 0;
    isPlaying: boolean = false;
    sendProgressIntervalId = setInterval(this.sendCurrentPosition, 100);
    onProgress?: (currentPosition: number) => void;
    onStopped?: () => void;

    get duration(): number {
        return this.audioBuffer.duration;
    }

    get currentPosition(): number {
        return clamp(this.ctx.currentTime - this.startTime, 0, this.duration);
    }

    async decode(buffer: ArrayBuffer, isWav: boolean, sdt?: SdtEntry){
        if(sdt){
            this.audioBuffer = pcmToAudioBuffer(this.ctx, buffer, sdt.samples);
        } else if(isWav){
            try {
                this.audioBuffer = decodeImaAdpcm(this.ctx, buffer);
                this.meta.isImaAdpcm = true;
            } catch(e){}
        }
        if(!this.audioBuffer) {
            this.audioBuffer = await this.ctx.decodeAudioData(buffer);
        }
    }

    start(at: number = 0): void {
        // if another src is currently playing, stop it without sending events
        // as we did not _stop_ the playback, we just moved the position
        if(this.src){
            this.src.removeEventListener('ended', this.handleEndedEvent);
            this.src.stop();
        }

        // setup new src
        this.src = this.ctx.createBufferSource();
        this.src.buffer = this.audioBuffer;
        this.src.connect(this.ctx.destination);
        this.src.start(0, at);
        this.src.addEventListener('ended', this.handleEndedEvent);
        this.startTime = this.ctx.currentTime - at;
        this.isPlaying = true;
    }

    stop(): void {
        if(!this.src){
            return;
        }
        this.src.stop();
        this.src = undefined;
    }

    @bind
    sendCurrentPosition(){
        if(this.isPlaying && typeof this.onProgress === 'function'){
            this.onProgress(this.currentPosition);
        }
    }

    @bind
    private handleEndedEvent(){
        this.sendCurrentPosition();
        this.isPlaying = false;
        if(typeof this.onStopped === 'function'){
            this.onStopped();
        }
    }
}

export class AudioControls {
    player: IAudioPlayer;
    resumeAt: number = 0;
    onProgress?: (currentPosition: number) => void;
    onStopped?: () => void;

    constructor(player: IAudioPlayer){
        this.player = player;
        this.player.onStopped = this.handlePlayerStoppedEvent;
        this.player.onProgress = this.triggerProgressEvent;
    }

    play(){
        this.player.start(this.resumeAt);
    }

    pause(){
        this.resumeAt = this.player.currentPosition;
        this.player.stop();
    }

    stop(){
        this.resumeAt = 0;
        this.player.stop();
    }

    scrobble(position: number){
        if(this.player.isPlaying){
            this.player.start(position);
        } else {
            this.resumeAt = position;
        }
        this.triggerProgressEvent(position);
    }

    @bind
    handlePlayerStoppedEvent(){
        // reset if the audio really ended
        if(this.player.currentPosition >= this.player.duration){
            this.resumeAt = 0;
        }
        this.triggerStoppedEvent();
    }

    triggerStoppedEvent(){
        if(this.onStopped){
            this.onStopped();
        }
    }

    @bind
    triggerProgressEvent(position: number){
        if(this.onProgress){
            this.onProgress(position);
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
        const player = new BrowserAudioPlayer();
        const controls = new AudioControls(player);
        await player.decode(buffer, this.props.node.name.toLowerCase().endsWith('.wav'), this.props.node.data.sdtEntry);
        this.setState({ player, controls });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Loading Buffer..."/>
        }
        if(!this.state.controls || !this.state.player){
            return <MoleculeLoadingScreen title="Decoding Buffer..."/>
        }

        const fileExtensionMatch = this.props.node.name.match(/\.(.*)$/);
        let audioFormat = 'Unknown';

        if(fileExtensionMatch){
            audioFormat = fileExtensionMatch[1].toUpperCase();
        }
        if(this.state.player.meta.isImaAdpcm){
            audioFormat = 'IMA-ADPCM';
        }
        if(this.props.node.data.sdtEntry){
            audioFormat = 'PCM (from SDT)';
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {audioFormat}
                {', ' + this.state.player.audioBuffer.numberOfChannels + ' '}
                Channel{this.state.player.audioBuffer.numberOfChannels > 1 ? 's' : ''}
                <div style={{ marginTop: 'auto' }}>
                    <OrganismAudioPlayer controls={this.state.controls} autoplay/>
                </div>
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
