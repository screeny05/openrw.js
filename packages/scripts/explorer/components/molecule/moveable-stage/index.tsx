import * as React from 'react';
import { Layer } from 'react-konva';
import bind from 'bind-decorator';
import { clamp } from '@rws/scripts/explorer/library/math';
import { ReactNode } from 'react';

interface Props {
    children: (x: number) => void | ReactNode;
    minZoom?: number;
    maxZoom?: number;
}

interface State {
    x: number;
    y: number;
    zoom: number;
}

export class MoleculeMoveableStage extends React.Component<Props, State> {
    state: State = {
        x: 0,
        y: 0,
        zoom: 0.1
    };

    debounceTimer?: number;
    isScrolling: boolean = false;

    componentWillMount(){
        window.addEventListener('mousewheel', this.onWheel);
    }

    componentWillUnmount(){
        window.removeEventListener('mousewheel', this.onWheel);
    }

    render(){
        return (
            <Layer x={this.state.x} y={this.state.y} scaleX={this.state.zoom} scaleY={this.state.zoom}>
                {this.props.children(this.state.zoom)}
            </Layer>
        );
    }

    @bind
    onWheel(e: WheelEvent){
        if(!(e.target instanceof HTMLCanvasElement)){
            return;
        }

        e.preventDefault();

        if(!this.debounceTimer && e.metaKey){
            this.isScrolling = true;
        }

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(this.onDebounce, 100) as any;

        if(this.isScrolling){
            const { left, top } = e.target.getBoundingClientRect();
            const { zoom } = this.state;
            const newZoom = clamp(zoom + (zoom * e.deltaY * -0.005), 0.1, 1);
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            const mousePointToX = mouseX / zoom - this.state.x / zoom;
            const mousePointToY = mouseY / zoom - this.state.y / zoom;
            const x = -(mousePointToX - mouseX / newZoom) * newZoom;
            const y = -(mousePointToY - mouseY / newZoom) * newZoom;

            this.setState({
                zoom: newZoom,
                x,
                y
            });
        } else {
            this.setState({
                x: this.state.x - e.deltaX,
                y: this.state.y - e.deltaY
            });
        }
    }

    @bind
    onDebounce(){
        this.debounceTimer = undefined;
        this.isScrolling = false;
    }
}
