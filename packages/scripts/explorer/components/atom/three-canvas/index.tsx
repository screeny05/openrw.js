import * as React from 'react';
import { BrowserLoop } from '@rws/platform-loop-browser';
import { WebGLRenderer, Camera, PerspectiveCamera, OrthographicCamera } from 'three';
import { BrowserInput } from '@rws/platform-control-browser';
import { AtomGlContainerConsumer } from '../gl-container-consumer';
import bind from 'bind-decorator';

interface Props {
    className?: string;
    tickCallback: (delta: number, renderer: WebGLRenderer, input?: BrowserInput, camera?: Camera) => void;
    glContainer: any;
    enableInput?: boolean;
    camera?: 'perspective' | 'orthographic';
}

export class AtomThreeCanvas extends React.PureComponent<Props> {
    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    loop: BrowserLoop = new BrowserLoop();
    renderer: WebGLRenderer;
    input?: BrowserInput;
    camera?: Camera;

    width: number;
    height: number;

    render(){
        return (
            <AtomGlContainerConsumer glContainer={this.props.glContainer} onHide={this.onHide} onShow={this.onShow}>
                {({ width, height }) => {
                    this.width = width;
                    this.height = height;
                    this.setCameraPerspective();

                    return (
                        <canvas ref={this.canvasRef} className={this.props.className} tabIndex={0} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }} {...{ width, height }}/>
                    );
                }}
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

        if(this.props.enableInput !== false){
            this.input = new BrowserInput(this.canvasRef.current);
        }
        if(this.props.camera === 'perspective'){
            this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
            this.camera.up.set(0, 0, 1);
            this.camera.position.y = 3;
            this.camera.lookAt(0, 0, 0);
        }
        if(this.props.camera === 'orthographic'){
            this.camera = new OrthographicCamera(-1, 1, -1, 1, 0, 30);
        }

        this.loop.setTickCallback(this.tickCallback.bind(this));
        this.loop.start();
    }

    /* I don't like this. */
    setCameraPerspective(): void {
        if(this.props.camera === 'perspective' && this.camera){
            const camera = this.camera as PerspectiveCamera;
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
        }
        if(this.props.camera === 'orthographic' && this.camera){
            const camera = this.camera as OrthographicCamera;
            camera.left = this.width / -2;
            camera.right = this.width / 2;
            camera.bottom = this.height / -2;
            camera.top = this.height / 2;
            camera.updateProjectionMatrix();
        }
        if(this.renderer){
            this.renderer.setSize(this.width, this.height);
        }
    }

    componentWillUnmount(): void {
        this.loop.stop();
    }

    tickCallback(delta: number): void {
        this.props.tickCallback(delta, this.renderer, this.input, this.camera);
        if(this.input){
            this.input.update(delta);
        }
    }

    @bind
    onHide(): void {
        this.loop.stop();
    }

    @bind
    onShow(): void {
        this.loop.start();
    }
}
