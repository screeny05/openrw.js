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
import { Mesh, Quaternion, Vector3 } from 'three';
import { vec4, quat, vec3 } from 'gl-matrix';
import { MoleculePlayerControls } from '../../components/molecule/player-controls';
import IconLinearScale from 'material-design-icons/editor/svg/production/ic_linear_scale_24px.svg';

const hasRotation = (keyframe): keyframe is IfpKeyframeRotation => keyframe && keyframe.rotation;
const hasTranslation = (keyframe): keyframe is IfpKeyframeRotationTranslation => keyframe && keyframe.translation;
const hasScale = (keyframe): keyframe is IfpKeyframeRotationTranslationScale => keyframe && keyframe.scale;

class AnimationHelper {
    animation: IfpTAnimation;
    duration: number;

    constructor(animation: IfpTAnimation){
        this.animation = animation;
        this.duration = this.getDuration();
    }

    private getDuration(): number {
        let maxLength = 0;
        this.animation.dgan.entries.forEach(entry => {
            const time = entry.data.frames[entry.data.frames.length - 1].time;
            if(time > maxLength){
                maxLength = time;
            }
        });
        return maxLength;
    }

    setMeshTransform(mesh: Mesh, frame: IfpKeyframeBase): void {
        if(hasRotation(frame)){
            let quatTo = new Quaternion(frame.rotation[0], frame.rotation[1], frame.rotation[2], frame.rotation[3]);
            //let quatTo = new Quaternion(frame.rotation[0], frame.rotation[2], frame.rotation[1], frame.rotation[3]);
            //let quatTo = new Quaternion(frame.rotation[1], frame.rotation[2], frame.rotation[0], frame.rotation[3]);
            //let quatTo = new Quaternion(frame.rotation[2], frame.rotation[1], frame.rotation[0], frame.rotation[3]);
            //let quatTo = new Quaternion(frame.rotation[1], frame.rotation[0], frame.rotation[2], frame.rotation[3]);
            //let quatTo = new Quaternion(frame.rotation[2], frame.rotation[0], frame.rotation[1], frame.rotation[3]);

            if(mesh.parent){
                //quatTo = quatTo.multiply(mesh.parent.getWorldQuaternion().inverse());
            }
            mesh.rotation.setFromQuaternion(quatTo);
        }
        if(hasTranslation(frame)){
            mesh.position.set(frame.translation[0], frame.translation[1], frame.translation[2]);
        }
        if(hasScale(frame)){
            mesh.scale.set(frame.scale[0], frame.scale[1], frame.scale[2]);
        }
    }
}

const getMeshes = (root: Mesh) => {
    const swaist = root.children[0] as Mesh;
    const [smid, supperlegl, supperlegr] = swaist.children as Mesh[];
    const storso = smid.children[0] as Mesh;
    const [supperarml, supperarmr, shead] = storso.children as Mesh[];
    const slowerarml = supperarml.children[0] as Mesh;
    const slhand = slowerarml.children[0] as Mesh;
    const slowerarmr = supperarmr.children[0] as Mesh;
    const srhand = slowerarmr.children[0] as Mesh;
    const slowerlegl = supperlegl.children[0] as Mesh;
    const sfootl = slowerlegl.children[0] as Mesh;
    const slowerlegr = supperlegr.children[0] as Mesh;
    const sfootr = slowerlegr.children[0] as Mesh;

    return {
        root,
        swaist,
        smid,
        storso,
        shead,
        supperarml, slowerarml, slhand,
        supperarmr, slowerarmr, srhand,
        supperlegl, slowerlegl, sfootl,
        supperlegr, slowerlegr, sfootr,
    };
};

interface Transform {
    translate: Vector3;
    rotate: Quaternion;
    scale: Vector3;
}

const getTransform = (mesh: Mesh): Transform => ({
    translate: mesh.position.clone(),
    rotate: mesh.quaternion.clone(),
    scale: mesh.scale.clone(),
});

const setTransform = (mesh: Mesh, transform: Transform): void => {
    mesh.position.set(transform.translate.x, transform.translate.y, transform.translate.z);
    mesh.quaternion.set(transform.rotate.x, transform.rotate.y, transform.rotate.z, transform.rotate.w);
    mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
};

const getMeshTransforms = (meshes: ReturnType<typeof getMeshes>) => ({
    root: getTransform(meshes.root),
    swaist: getTransform(meshes.swaist),
    smid: getTransform(meshes.smid),
    storso: getTransform(meshes.storso),
    shead: getTransform(meshes.shead),
    supperarml: getTransform(meshes.supperarml),
    slowerarml: getTransform(meshes.slowerarml),
    slhand: getTransform(meshes.slhand),
    supperarmr: getTransform(meshes.supperarmr),
    slowerarmr: getTransform(meshes.slowerarmr),
    srhand: getTransform(meshes.srhand),
    supperlegl: getTransform(meshes.supperlegl),
    slowerlegl: getTransform(meshes.slowerlegl),
    sfootl: getTransform(meshes.sfootl),
    supperlegr: getTransform(meshes.supperlegr),
    slowerlegr: getTransform(meshes.slowerlegr),
    sfootr: getTransform(meshes.sfootr),
});

const applyTransforms = (meshes: ReturnType<typeof getMeshes>, transforms: ReturnType<typeof getMeshTransforms>): void => {
    setTransform(meshes.root, transforms.root);
    setTransform(meshes.swaist, transforms.swaist);
    setTransform(meshes.smid, transforms.smid);
    setTransform(meshes.storso, transforms.storso);
    setTransform(meshes.shead, transforms.shead);
    setTransform(meshes.supperarml, transforms.supperarml);
    setTransform(meshes.slowerarml, transforms.slowerarml);
    setTransform(meshes.slhand, transforms.slhand);
    setTransform(meshes.supperarmr, transforms.supperarmr);
    setTransform(meshes.slowerarmr, transforms.slowerarmr);
    setTransform(meshes.srhand, transforms.srhand);
    setTransform(meshes.supperlegl, transforms.supperlegl);
    setTransform(meshes.slowerlegl, transforms.slowerlegl);
    setTransform(meshes.sfootl, transforms.sfootl);
    setTransform(meshes.supperlegr, transforms.supperlegr);
    setTransform(meshes.slowerlegr, transforms.slowerlegr);
    setTransform(meshes.sfootr, transforms.sfootr);
};

interface State {
    isLoaded: boolean;
    ifp?: IfpAnpk;
    timestamp: number;
    currentAnimation?: IfpTAnimation;
    animationStartTime: number;
    animationHelper?: AnimationHelper;
    speed: number;
    isPlaying: boolean;
    isRepeating: boolean;
    isInterpolating: boolean;
}

interface Props {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

export class FileAnimationViewer extends React.Component<Props, State> {
    state: State = {
        isLoaded: false,
        animationStartTime: 0,
        timestamp: 0,
        speed: 1,
        isPlaying: false,
        isRepeating: false,
        isInterpolating: false
    };

    scene: Scene;
    ped: Mesh;
    meshes: ReturnType<typeof getMeshes>;
    initialTransforms: ReturnType<typeof getMeshTransforms>;

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

        //await pool.definitionPool.loadTextureByDffName('sub_indland01');
        await pool.texturePool.loadFromImg('models/gta3.img', 'player.txd');
        await pool.meshPool.loadFromImg('models/gta3.img', 'player.dff');
        //await pool.meshPool.loadFromImg('models/gta3.img', 'sub_indland01.dff');

        const grid = new GridHelper(10, 10);
        grid.rotateX(Math.PI / 2);

        const ped = (pool.meshPool.get('player') as ThreeMesh).src as unknown as Mesh;
        this.ped = ped;
        this.meshes = getMeshes(ped);
        this.initialTransforms = getMeshTransforms(this.meshes);

        this.scene = new Scene();
        this.scene.background = new Color(1, 1, 1);
        this.scene.add(ped);
        this.scene.add(grid);
        //this.scene.add((pool.meshPool.get('sub_indland01') as any).src);
        console.log(ped);

        this.setState({
            isLoaded: true,
            //currentAnimation: ifp ? ifp.entries[0] : undefined,
            //animationHelper: ifp ? new AnimationHelper(ifp.entries[0]) : undefined,
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
                    <MoleculeSelectList heightAdd={-44} glContainer={this.props.glContainer} items={this.state.ifp.entries} onSelect={this.onSelectEntry} selected={this.state.currentAnimation}/>
                </div>
                <div style={{ position: 'relative' }}>
                    <MoleculePlayerControls
                        duration={this.state.animationHelper ? this.state.animationHelper.duration : 0}
                        elapsed={(this.state.timestamp - this.state.animationStartTime) / 1000 * this.state.speed}
                        onSetSpeed={this.onSetSpeed}
                        onClickRepeat={this.onClickRepeat}
                        speed={this.state.speed}
                        isPlaying={this.state.isPlaying}
                        isRepeating={this.state.isRepeating}
                        showSpeedControl
                        showRepeat
                        showMorePrecision>

                        <button className="player-controls__button player-constrols__button--scale" title="Interpolate" onClick={this.onClickInterpolate}>
                            <IconLinearScale class={'player-controls__icon ' + (this.state.isInterpolating ? 'player-controls__icon--active' : '')}/>
                        </button>
                    </MoleculePlayerControls>
                </div>
            </div>
        );
    }

    @bind
    onSelectEntry(entry: IfpTAnimation): void {
        this.resetTransform();
        this.setState({
            currentAnimation: entry,
            animationStartTime: this.state.timestamp,
            animationHelper: new AnimationHelper(entry),
        });
        console.log('set-anim', this.state.animationHelper, this.scene);
    }

    @bind
    onSetSpeed(speed: number): void {
        this.setState({
            speed,
            animationStartTime: this.state.timestamp
        });
    }

    @bind
    onClickRepeat(): void {
        this.setState({ isRepeating: !this.state.isRepeating });
    }

    @bind
    onClickInterpolate(): void {
        this.setState({ isInterpolating: !this.state.isInterpolating });
    }

    @bind
    onTick(delta: number, renderer: WebGLRenderer, input, camera: PerspectiveCamera): void {
        const timestamp = this.state.timestamp + delta;
        const animationElapsed = (timestamp - this.state.animationStartTime) / 1000;

        if(this.state.currentAnimation && animationElapsed <= this.state.animationHelper!.duration / this.state.speed){
            this.setState({
                timestamp,
                isPlaying: true
            });
            this.state.currentAnimation.dgan.entries.forEach(entry => {
                const mesh = this.meshes[entry.name.toLowerCase()];
                if(['smid'].indexOf(entry.name.toLowerCase()) === -1){
                    //return;
                }
                if(!mesh){
                    console.log(this.ped, entry);
                    throw new Error('Mesh ' + entry.name + ' not found.');
                }

                const frame = this.interpolateKeyframes(animationElapsed * this.state.speed, entry.data.frames);
                this.state.animationHelper!.setMeshTransform(mesh as Mesh, frame);
            });
        } else if(this.state.isRepeating) {
            this.setState({ animationStartTime: this.state.timestamp });
        } else {
            this.setState({ isPlaying: false });
        }

        renderer.render(this.scene, camera);
    }

    resetTransform(): void {
        applyTransforms(this.meshes, this.initialTransforms);
    }

    interpolateKeyframes<T extends IfpKeyframeBase>(currentTime: number, frames: T[]): T {
        const interpolated: any = { time: currentTime };
        const getFractionBetween = (start, end, current) => (current - start) / (end - start);
        const nextFrame = frames.find(frame => frame.time >= currentTime);
        const previousFrame = frames.reverse().find(frame => frame.time <= currentTime);
        // re-reverse
        frames.reverse();

        const firstFrameTimestamp = frames[0].time;
        const lastFrameTimestamp = frames[frames.length - 1].time
        if(currentTime < firstFrameTimestamp){
            return interpolated;
        }
        if(currentTime > lastFrameTimestamp){
            return frames[frames.length - 1];
        }

        if(!previousFrame || !nextFrame){
            console.error('Frames', frames, currentTime);
            throw new Error('Frame not found');
        }

        if(!this.state.isInterpolating){
            return nextFrame;
        }

        const t = getFractionBetween(previousFrame.time, nextFrame.time, currentTime);

        if(hasRotation(nextFrame) && hasRotation(previousFrame)){
            interpolated.rotation = quat.create();
            quat.lerp(interpolated.rotation, previousFrame.rotation, nextFrame.rotation, t);
        }

        if(hasTranslation(nextFrame) && hasTranslation(previousFrame)){
            interpolated.translation = vec3.create();
            vec3.lerp(interpolated.translation, previousFrame.translation, nextFrame.translation, t);
        }

        if(hasScale(nextFrame) && hasScale(previousFrame)){
            interpolated.scale = vec3.create();
            vec3.lerp(interpolated.scale, previousFrame.scale, nextFrame.scale, t);
        }

        return interpolated;
    }
}
