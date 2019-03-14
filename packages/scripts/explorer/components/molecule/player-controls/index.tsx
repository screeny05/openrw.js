import * as React from 'react';
import './index.scss';
import { AtomProgressBar, ProgressBarDirection } from '../../atom/progress-bar';
import bind from '@rws/game/node_modules/bind-decorator';
import IconPlay from 'material-design-icons/av/svg/production/ic_play_arrow_24px.svg';
import IconPause from 'material-design-icons/av/svg/production/ic_pause_24px.svg';
import IconSlowMotion from 'material-design-icons/av/svg/production/ic_slow_motion_video_24px.svg';
import IconRepeat from 'material-design-icons/av/svg/production/ic_repeat_24px.svg';

interface Props {
    showSpeedControl?: boolean;
    showMorePrecision?: boolean;
    showRepeat?: boolean;
    onClickPlayPause?: () => void;
    onClickRepeat?: () => void;
    onScrobble?: (value: number) => void;
    onSetSpeed?: (value: number) => void;
    isPlaying: boolean;
    isRepeating?: boolean;
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
                <button className="player-controls__button player-controls__button--play-pause" onClick={this.onClickPlayPause} title="Play/Pause">
                    {this.props.isPlaying ? <IconPause fill="#fff"/> : <IconPlay fill="#fff"/>}
                </button>
                {this.props.showRepeat ?
                    <button className="player-controls__button player-controls__button--repeat" onClick={this.onClickRepeat} title="Repeat">
                        <IconRepeat fill={this.props.isRepeating ? '#1779ba' : '#fff'}></IconRepeat>
                    </button>
                : ''}
                <div className="player-controls__label">
                    {this.formatValue(Math.min(this.props.elapsed, this.props.duration))}
                </div>
                <div className="player-controls__progress">
                    <AtomProgressBar value={this.props.elapsed} max={this.props.duration} onMoveKnob={this.onMoveProgressBar}/>
                </div>
                <div className="player-controls__label">
                    {this.formatValue(this.props.duration)}
                </div>
                {this.props.showSpeedControl ?
                    <div className="player-controls__speed">
                        <button className="player-controls__button" onClick={this.onClickSpeedControlButton} title="Playback Speed">
                            <IconSlowMotion fill={this.state.isSpeedControlUnfolded ? '#1779ba' : '#fff'}/>
                            x{this.props.speed ? this.props.speed : 1}
                        </button>
                        {this.state.isSpeedControlUnfolded ?
                            <div className="player-controls__speed-bar">
                                <AtomProgressBar
                                    value={this.props.speed ? this.props.speed : 1}
                                    min={0.1}
                                    max={2}
                                    direction={ProgressBarDirection.VERTICAL}
                                    onMoveKnob={this.onMoveSpeedBar}
                                    steps={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5, 1.75, 2]}/>
                            </div>
                        : ''}
                    </div>
                : ''}
                {this.props.children}
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
    onClickRepeat(){
        if(this.props.onClickRepeat){
            this.props.onClickRepeat();
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

    @bind
    onClickSpeedControlButton(): void {
        this.setState({
            isSpeedControlUnfolded: !this.state.isSpeedControlUnfolded
        });
    }

    formatValue(value: number): string {
        const minutes = Math.floor(value / 60).toString().padStart(2, '0');
        const seconds = Math.floor(value % 60).toString().padStart(2, '0');
        const miliseconds = Math.round((value - Math.floor(value)) * 1000).toString().padEnd(3, '0');
        return `${minutes}:${seconds}${this.props.showMorePrecision ? `.${miliseconds}` : ''}`;
    }
}
