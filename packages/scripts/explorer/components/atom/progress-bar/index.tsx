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
    steps?: number[];
    value: number;
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
            <div className={`progress-bar progress-bar--${this.isHorizontal ? 'horizontal' : 'vertical'}`}>
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
        const clampedValue = clamp(this.props.value, min, max);
        const valueInRange = clampedValue - min;
        const rangePercentage = valueInRange / range * 100;

        return { min, max, range, rangeValue: valueInRange, rangePercentage };
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
        const closestValue = this.getClosestStepValue(value);
        this.sendKnobMove(closestValue);
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
        const closestValue = this.getClosestStepValue(value);

        this.sendKnobMove(closestValue);
    }

    getClosestStepValue(value: number): number {
        if(!this.props.steps){
            return value;
        }
        return this.props.steps.sort((a, b) => Math.abs(value - a) - Math.abs(value - b))[0];
    }

    getValueByAbsolutePosition(x: number, y: number): number {
        const { top, left, height } = this.getProgressBarBounds();
        x = x - left;
        y = y - top;
        return this.relativePositionToValue(this.isHorizontal ? x : height - y);
    }

    relativePositionToValue(position: number): number {
        const { min, max, range } = this.getComputedProps();
        const { width, height } = this.getProgressBarBounds();
        const positionPercentage = position / (this.isHorizontal ? width : height);
        const value = min + range * positionPercentage;
        return clamp(value, min, max);
    }

    valueToRelativePosition(value: number): number {
        const { min, range } = this.getComputedProps();
        const { width, height } = this.getProgressBarBounds();
        const valuePercentage = (value - min) / range;
        return this.isHorizontal ? width * valuePercentage : height * valuePercentage;
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
