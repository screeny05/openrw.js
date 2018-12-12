import * as React from 'react';
import { AudioPlayer } from 'packages/scripts/explorer/views/file-audio-player';
import { bind } from 'bind-decorator';

interface Props {
    player: AudioPlayer;
    autoplay?: boolean;
}

interface State {
    elapsed: number;
    isPlaying: boolean;
}

export class OrganismAudioPlayer extends React.Component<Props, State> {
    state: State = {
        elapsed: 0,
        isPlaying: false
    }

    componentDidMount(){
        this.props.player.onProgressCb = elapsed => this.setState({ elapsed });

        // replace with statechange event
        this.props.player.onEndedCb = () => this.setState({ isPlaying: false });
        if(this.props.autoplay){
            this.props.player.play();
            this.setState({ isPlaying: true });
        }
    }

    componentWillUnmount(){
        this.props.player.onProgressCb = undefined;
        this.props.player.onEndedCb = undefined;
    }

    render(){
        return (
            <div className="player">
                <div className="player__elapsed">{this.formatDuration(this.state.elapsed)}</div>
                <div className="player__runtime">{this.formatDuration(this.props.player.duration)}</div>
                <progress className="player__progress" value={this.state.elapsed} max={this.props.player.duration}/>
                <button className="player__play-pause" onClick={this.onClickPlayPause}>{this.state.isPlaying ? '||' : '>'}</button>
            </div>
        );
    }

    formatDuration(seconds: number): string {
        return Math.floor(seconds / 60) + ':' + Math.floor(seconds % 60).toString().padStart(2, '0');
    }

    @bind
    onClickPlayPause(){
        if(this.state.isPlaying){
            this.props.player.pause();
        } else {
            this.props.player.play();
        }
        this.setState({ isPlaying: !this.state.isPlaying });
    }
}
