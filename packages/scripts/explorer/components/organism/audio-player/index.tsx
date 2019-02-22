import * as React from 'react';
import { AudioControls } from 'packages/scripts/explorer/views/file-audio-player';
import { bind } from 'bind-decorator';
import { MoleculePlayerControls } from '../../molecule/player-controls';

interface Props {
    controls: AudioControls;
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
        this.props.controls.onProgress = elapsed => this.setState({ elapsed });

        // replace with statechange event
        this.props.controls.onStopped = () => this.setState({ isPlaying: false });
        if(this.props.autoplay){
            this.props.controls.play();
            this.setState({ isPlaying: true });
        }
    }

    componentWillUnmount(){
        this.props.controls.stop();
        this.props.controls.onProgress = undefined;
        this.props.controls.onStopped = undefined;
    }

    render(){
        return (
            <MoleculePlayerControls
                elapsed={this.state.elapsed}
                duration={this.props.controls.player.duration}
                isPlaying={this.state.isPlaying}
                onClickPlayPause={this.onClickPlayPause}
                onScrobble={this.onControlsScrobble}/>
        );
    }

    @bind
    onClickPlayPause(): void {
        if(this.state.isPlaying){
            this.props.controls.pause();
        } else {
            this.props.controls.play();
        }
        this.setState({ isPlaying: !this.state.isPlaying });
    }

    @bind
    onControlsScrobble(value: number): void {
        this.props.controls.scrobble(value);
    }
}
