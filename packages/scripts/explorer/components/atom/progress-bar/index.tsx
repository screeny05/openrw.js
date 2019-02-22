import * as React from 'react';
import './index.scss';
import bind from 'bind-decorator';
import { clamp } from '../../../library/math';

export enum ProgressBarDirection {
    HORIZONTAL,
    VERTICAL
}

interface Props {
    min?: number;
    max: number;
    value: number;
    className?: string;
    onMoveKnob?: (value: number) => void;
    direction?: ProgressBarDirection;
}

interface State {
    isMouseDown: boolean;
}

export class AtomProgressBar extends React.PureComponent<Props, State> {
    state: State = {
        isMouseDown: false
    }

    progressBarRef: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount(){
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }

    componentWillUnmount(){
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

    render(){
        const { rangePercentage } = this.getComputedProps();

        return (
            <div className={`progress-bar ${this.props.className} progress-bar--${this.isHorizontal ? 'horizontal' : 'vertical'}`}>
                <div className="progress-bar__inner" onMouseDown={this.onMouseDown} ref={this.progressBarRef}>
                    <div className="progress-bar__bar"></div>
                    <div className="progress-bar__fill" style={{ [this.isHorizontal ? 'width' : 'height']: `${rangePercentage}%` }}>
                        <div className="progress-bar__knob"></div>
                    </div>
                </div>
            </div>
        );
    }

    getComputedProps(){
        const propMin = this.props.min ? this.props.min : 0;
        const min = propMin <= this.props.max ? propMin : this.props.max;
        const max = this.props.max >= propMin ? this.props.max : propMin;
        const range = max - min;
        const rangeValue = this.props.value - min;
        const rangePercentage = rangeValue / range * 100;

        return { min, max, range, rangeValue, rangePercentage };
    }

    get isHorizontal(): boolean {
        return this.props.direction !== ProgressBarDirection.VERTICAL;
    }

    @bind
    onMouseDown(e: React.MouseEvent): void {
        if(e.nativeEvent.which !== 1){
            return;
        }
        const value = this.getValueByAbsolutePosition(e.clientX, e.clientY);
        this.sendKnobMove(value);
        this.setState({ isMouseDown: true });
    }

    @bind
    onMouseUp(e: MouseEvent): void {
        if(!this.state.isMouseDown){
            return;
        }
        this.setState({ isMouseDown: false });
    }

    @bind
    onMouseMove(e: MouseEvent): void {
        if(!this.state.isMouseDown){
            return;
        }
        const value = this.getValueByAbsolutePosition(e.clientX, e.clientY);
        this.sendKnobMove(value);
    }

    getValueByAbsolutePosition(x: number, y: number): number {
        const { min, max, range } = this.getComputedProps();
        const { top, left, width, height } = this.getProgressBarBounds();
        x = x - left;
        y = y - top;

        const position = this.isHorizontal ? x : height - y;
        const positionPercentage = position / (this.isHorizontal ? width : height);
        const value = min + range * positionPercentage;
        return clamp(value, min, max);
    }

    getProgressBarBounds(): ClientRect {
        if(!this.progressBarRef.current){
            throw new Error('Cannot get progressbar bounds.');
        }
        return this.progressBarRef.current.getBoundingClientRect();
    }

    sendKnobMove(value: number): void {
        if(typeof this.props.onMoveKnob === 'function'){
            this.props.onMoveKnob(value);
        }
    }
}
