import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { AtomThreeCanvas } from '../../components/atom/three-canvas';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import bind from 'bind-decorator';
import { PerspectiveCamera, WebGLRenderer, Color, BoxGeometry, Mesh, MeshPhongMaterial, EdgesGeometry, LineSegments, Scene, DoubleSide } from '@rws/platform-graphics-three/node_modules/three';
import { IplIndex, IplEntryZone } from '@rws/library/index/ipl';
import { BrowserInput } from '@rws/platform-control-browser';
import { CameraControlFree } from '@rws/game/camera-controls-free';
import { InputControlMapper, defaultMap } from '@rws/platform/control';
import { ThreeObject3d } from '@rws/platform-graphics-three/object3d';
import { vec3 } from 'gl-matrix';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { MoleculeMoveableStage } from '../../components/molecule/moveable-stage';

interface State {
    isLoaded: boolean;
    zones?: IplEntryZone[];
}

interface Props {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

const ZoneRect = ({ zone, zoom }: { zone: IplEntryZone, zoom: number }) => {
    const x = zone.positionCornerA[0] + 4000;
    const y = zone.positionCornerA[1] + 4000;

    return (
        <React.Fragment>
            <Rect
                x={x}
                y={y}
                width={(zone.positionCornerB[0] - zone.positionCornerA[0])}
                height={(zone.positionCornerB[1] - zone.positionCornerA[1])}
                fill='#fff2'
                stroke='#fff'
                strokeWidth={1 / zoom}
            />
            <Text
                text={zone.name}
                x={x + 10}
                y={y + 10}
                fontSize={10 / zoom}
            />
        </React.Fragment>
    );
};

export class FileZoneViewer extends React.Component<Props, State> {
    state: State = {
        isLoaded: false,
    };

    scene: Scene;
    control?: InputControlMapper;
    cameraControls?: CameraControlFree;

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        const file: BrowserFile = this.props.node.data.file;
        const ipl = new IplIndex(file);
        await ipl.load();

        this.scene = new Scene();
        this.scene.background = new Color(1, 1, 1);

        const zones = ipl.entriesZone;
        zones.push({
            level: 0,
            name: 'CITYZON',
            positionCornerA: vec3.fromValues(-4000, -4000, -500),
            positionCornerB: vec3.fromValues(4000, 4000, 500),
            type: 0
        });

        console.log(zones, this.scene);

        this.setState({
            isLoaded: true,
            zones
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Parsing IPL..."/>
        }
        if(!this.state.zones){
            return <div>unable to parse IPL</div>;
        }

        return (
            <div>
                <Stage width={this.props.glContainer.width} height={this.props.glContainer.height} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}>
                    <MoleculeMoveableStage>
                        {zoom => this.state.zones!.map(zone => <ZoneRect zone={zone} zoom={zoom}/>)}
                    </MoleculeMoveableStage>
                </Stage>
            </div>
        );
    }
}
