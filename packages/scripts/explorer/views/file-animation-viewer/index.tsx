import * as React from 'react';
import Corrode from '@rws/library/node_modules/corrode';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { IfpAnpk } from '@rws/library/parser-bin/ifp';
import { ImgIndex } from '@rws/library/index/img';
import { RwsStructPool } from '@rws/library/rws-struct-pool';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { ThreeTexturePool } from '@rws/platform-graphics-three/texture-pool';
import { ThreeMeshPool } from '@rws/platform-graphics-three/mesh-pool';
import { IfpTAnimation, IfpKR00, IfpKRT0, IfpKRTS, IfpKeyframeRotation, IfpKeyframeRotationTranslation, IfpKeyframeRotationTranslationScale, IfpKeyframeBase } from '@rws/library/parser-bin/ifp/anim';
import { AtomThreeCanvas } from '../../components/atom/three-canvas';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import { MoleculeSelectList } from '../../components/molecule/select-list';
import bind from 'bind-decorator';
import { PerspectiveCamera, WebGLRenderer, Color, GridHelper, Scene } from '@rws/platform-graphics-three/node_modules/three';
import { ThreeMesh } from '@rws/platform-graphics-three/mesh';
import { Mesh, Quaternion } from 'three';
import { vec4, quat, vec3 } from 'gl-matrix';

interface State {
    isLoaded: boolean;
    ifp?: IfpAnpk;
    currentAnimation?: IfpTAnimation;
}

interface Props {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

export class FileAnimationViewer extends React.Component<Props, State> {
    state: State = {
        isLoaded: false,
    };

    scene: Scene;
    ped: Mesh;
    timestamp: number = 0;

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        const file: BrowserFile|undefined = this.props.node.data.file;
        const entry: DirEntry|undefined = this.props.node.data.entry;
        const parser = new Corrode().ext.ifp('ifp').map.push('ifp');
        let ifp: IfpAnpk|undefined;

        if(file){
            ifp = await file.parse<IfpAnpk>(parser)
        }
        if(entry){
            const img: ImgIndex = this.props.node.data.img;
            ifp = await img.imgFile.parse<IfpAnpk>(parser, entry.offset, entry.offset + entry.size)
        }

        const pool = new RwsStructPool(this.props.index, ThreeTexturePool, ThreeMeshPool, 'american');
        await pool.loadImg('models/gta3.img');
        await pool.loadLevelFile('data/default.dat', { ide: true, txd: true });
        await pool.loadLevelFile('data/gta3.dat', { ide: true, txd: true });

        await pool.definitionPool.loadTextureByDffName('male01');
        await pool.meshPool.loadFromImg('models/gta3.img', 'male01.dff');

        const grid = new GridHelper(10, 10);
        grid.rotateX(Math.PI / 2);

        const ped = (pool.meshPool.get('male01') as ThreeMesh).src;
        this.ped = ped as any;

        this.scene = new Scene();
        this.scene.background = new Color(1, 1, 1);
        this.scene.add(ped);
        this.scene.add(grid);

        this.setState({
            isLoaded: true,
            currentAnimation: ifp ? ifp.entries[0] : undefined,
            ifp
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Parsing IFP..."/>
        }
        if(!this.state.ifp){
            return <div>unable to parse ifp</div>;
        }

        return (
            <div>
                <AtomThreeCanvas glContainer={this.props.glContainer} tickCallback={this.onTick} camera='perspective'/>
                <div style={{ position: 'relative', zIndex: 1, width: 200 }}>
                    {this.state.ifp.name + ' - '}
                    {this.state.currentAnimation ? this.state.currentAnimation.name : ''}
                    <MoleculeSelectList heightAdd={-30} glContainer={this.props.glContainer} items={this.state.ifp.entries} onSelect={this.onSelectEntry} selected={this.state.currentAnimation}/>
                </div>
            </div>
        );
    }

    @bind
    onSelectEntry(entry: IfpTAnimation): void {
        console.log(entry,this.scene);
        this.setState({
            currentAnimation: entry
        });
    }

    @bind
    onTick(delta: number, renderer: WebGLRenderer, input, camera: PerspectiveCamera): void {
        this.timestamp += delta;

        camera.up.set(0, 0, -1);
        camera.position.y = 3;
        camera.lookAt(0, 0, 0);

        if(this.state.currentAnimation){
            this.state.currentAnimation.dgan.entries.forEach(entry => {
                const mesh = this.ped.getObjectByName(entry.name);
                if(!mesh){
                    return;
                }

                const frame = this.interpolateKeyframes(this.timestamp, entry.data.frames);
                this.setMeshTransform(mesh as Mesh, frame);
            });
        }

        renderer.render(this.scene, camera);
    }

    setMeshTransform(mesh: Mesh, frame: IfpKeyframeBase): void {
        if(hasRotation(frame)){
            mesh.rotation.setFromQuaternion(new Quaternion(frame.rotation[0], frame.rotation[1], frame.rotation[2], frame.rotation[3]));
        }
        if(hasTranslation(frame)){
            mesh.position.set(frame.translation[0], frame.translation[1], frame.translation[2]);
        }
        if(hasScale(frame)){
            mesh.scale.set(frame.scale[0], frame.scale[1], frame.scale[2]);
        }
    }

    mapTAnimation(): { [name: string]: IfpKeyframeBase[] } {
        const target = {};
        this.state.currentAnimation!.dgan.entries.forEach(entry => {
            target[entry.name.toLowerCase()] = entry.data.frames;
        });
        return target;
    }

    interpolateKeyframes<T extends IfpKeyframeBase>(delta: number, frames: T[]): T {
        const target: any = {};
        const getTimestampInDuration = (timestamp, duration) => timestamp - Math.floor(timestamp / duration) * duration;
        const getFractionBetween = (a, b, point) => ((b - a) - (b - point)) / (b - a);
        const currentTime = getTimestampInDuration(delta / 1000, frames[frames.length - 1].time);
        const nextStep = frames.find(frame => frame.time >= currentTime);
        const previousStep = frames.reverse().find(frame => frame.time <= currentTime);

        // re-reverse
        frames.reverse();

        if(!previousStep || !nextStep){
            throw new Error('Whoops!');
        }

        target.time = currentTime;
        const t = getFractionBetween(previousStep.time, nextStep.time, currentTime);

        if(hasRotation(nextStep) && hasRotation(previousStep)){
            target.rotation = vec4.create();
            vec4.lerp(target.rotation, previousStep.rotation, nextStep.rotation, t);
        }

        if(hasTranslation(nextStep) && hasTranslation(previousStep)){
            target.translation = vec3.create();
            vec3.lerp(target.translation, previousStep.translation, nextStep.translation, t);
        }

        if(hasScale(nextStep) && hasScale(previousStep)){
            target.scale = vec3.create();
            vec3.lerp(target.scale, previousStep.scale, nextStep.scale, t);
        }

        return target;
    }
}

const hasRotation = (keyframe): keyframe is IfpKeyframeRotation => keyframe && keyframe.rotation;
const hasTranslation = (keyframe): keyframe is IfpKeyframeRotationTranslation => keyframe && keyframe.translation;
const hasScale = (keyframe): keyframe is IfpKeyframeRotationTranslationScale => keyframe && keyframe.scale;

const interpolateVec4 = (a: vec4, b: vec4, t: number): vec4 => {
    const target = vec4.create();
    vec4.lerp(target, a, b, t);
    return target;
};
