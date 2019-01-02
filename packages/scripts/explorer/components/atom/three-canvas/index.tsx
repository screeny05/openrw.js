import * as React from 'react';
import { BrowserLoop } from '@rws/platform-loop-browser/index';
import { WebGLRenderer } from 'three';
import { BrowserInput } from '@rws/platform-control-browser/index';
import { AtomGlContainerConsumer } from '../gl-container-consumer';

interface Props {
    className?: string;
    tickCallback: (delta: number, renderer: WebGLRenderer, input: BrowserInput) => void;
    glContainer: any;
}

export class AtomThreeCanvas extends React.PureComponent<Props> {
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    loop: BrowserLoop = new BrowserLoop();
    renderer: WebGLRenderer;
    input: BrowserInput;

    render(){
        return (
            <AtomGlContainerConsumer glContainer={this.props.glContainer}>
                {({ width, height }) => (
                    <canvas ref={this.canvasRef} className={this.props.className} tabIndex={0} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }} {...{ width, height }}/>
                )}
            </AtomGlContainerConsumer>
        );
    }

    componentDidMount(): void {
        if(!this.canvasRef.current){
            throw new Error(`Couldn't acquire canvas ref`);
        }

        this.renderer = new WebGLRenderer({
            antialias: true,
            canvas: this.canvasRef.current
        });

        this.input = new BrowserInput(this.canvasRef.current);

        this.loop.setTickCallback(this.tickCallback.bind(this));
        this.loop.start();
    }

    componentWillUnmount(): void {
        this.loop.stop();
    }

    tickCallback(delta: number): void {
        this.props.tickCallback(delta, this.renderer, this.input);
        this.input.update(delta);
    }
}
