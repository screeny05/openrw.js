import * as React from 'react';
import './index.scss';
import { AtomProgressBar, ProgressBarDirection } from '../../atom/progress-bar';
import { Icon } from '../../atom/icon';
import bind from '@rws/game/node_modules/bind-decorator';

interface Props {
    showSpeedControl?: boolean;
    onClickPlayPause?: () => void;
    onScrobble?: (value: number) => void;
    onSetSpeed?: (value: number) => void;
    isPlaying: boolean;
    duration: number;
    elapsed: number;
    speed?: number;
}

interface State {
    isSpeedControlUnfolded: boolean;
}

export class MoleculePlayerControls extends React.PureComponent<Props, State> {
    state: State = {
        isSpeedControlUnfolded: false
    }

    render(){
        return (
            <div className="player-controls">
                <button className="player-controls__button player-controls__play-pause" onClick={this.onClickPlayPause}>
                    <Icon font="fa" name={this.props.isPlaying ? 'pause' : 'play'}/>
                </button>
                <div className="player-controls__label">
                    {this.formatValue(this.props.elapsed)}
                </div>
                <div className="player-controls__progress">
                    <AtomProgressBar value={this.props.elapsed} max={this.props.duration} onMoveKnob={this.onMoveProgressBar}/>
                </div>
                <div className="player-controls__label">
                    {this.formatValue(this.props.duration)}
                </div>
                {this.props.showSpeedControl ?
                    <div className="player-controls__speed">
                        <button className="player-controls__button" onClick={() => this.setState({ isSpeedControlUnfolded: !this.state.isSpeedControlUnfolded })}>
                            x{this.props.speed ? this.props.speed : 1}
                        </button>
                        {this.state.isSpeedControlUnfolded ?
                            <div className="player-controls__speed-bar">
                                <AtomProgressBar value={this.props.speed ? this.props.speed : 1} min={0.5} max={2} direction={ProgressBarDirection.VERTICAL} onMoveKnob={this.onMoveSpeedBar}/>
                            </div>
                        : ''}
                    </div>
                : ''}
            </div>
        );
    }

    @bind
    onClickPlayPause(){
        if(this.props.onClickPlayPause){
            this.props.onClickPlayPause();
        }
    }

    @bind
    onMoveProgressBar(value: number): void {
        if(typeof this.props.onScrobble === 'function'){
            this.props.onScrobble(value);
        }
    }

    @bind
    onMoveSpeedBar(value: number): void {
        if(typeof this.props.onSetSpeed === 'function'){
            this.props.onSetSpeed(value);
        }
    }

    formatValue(value: number): string {
        return Math.floor(value / 60) + ':' + Math.floor(value % 60).toString().padStart(2, '0');
    }
}
