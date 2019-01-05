import Corrode from 'corrode';
import { IfpHeader } from './header';
import { IfpInfo } from './info';
import { vec3, vec4 } from 'gl-matrix';

export interface IfpTAnimation {
    name: string;
    dgan: IfpInfo<IfpAnim>;
}

export interface IfpAnim {
    name: string;
    countFrames: number;
    next: number;
    prev: number;
    data: (IfpKR00|IfpKRT0|IfpKRTS);
}

export interface IfpKeyframeBase {
    time: number;
}

export interface IfpKeyframeRotation extends IfpKeyframeBase {
    rotation: vec4;
    time: number;
}
export type IfpKR00 = IfpKFRM<'R00', IfpKeyframeRotation>;

export interface IfpKeyframeRotationTranslation extends IfpKeyframeBase {
    rotation: vec4;
    translation: vec3;
}
export type IfpKRT0 = IfpKFRM<'RT0', IfpKeyframeRotationTranslation>;

export interface IfpKeyframeRotationTranslationScale extends IfpKeyframeBase {
    rotation: vec4;
    translation: vec3;
    scale: vec3;
}
export type IfpKRTS = IfpKFRM<'RTS', IfpKeyframeRotationTranslationScale>;

export interface IfpKFRM<K = string, T = any> {
    type: K;
    frames: T[];
}

Corrode.addExtension('TAnimation', function(){
    this
        .ext.ifpStruct('name', 'NAME')
        .ext.ifpStruct('dgan', 'DGAN')
});

Corrode.addExtension('ifpAnim', function(header: IfpHeader){
    // section might contain padding sometimes
    const fillSize = header.size - 28 - 4 * 4;

    this
        .string('name', 28)
        .map.trimNull('name')
        .int32('countFrames')
        .int32('unknown')
        .int32('next')
        .int32('prev')
        .skip(fillSize)
        .tap(function(){
            if(this.vars.countFrames > 0){
                this.ext.ifpStruct('data', ['KRT0', 'KR00', 'KRTS'], this.vars);
            } else {
                this.vars.data = [];
            }
        })
});

Corrode.addExtension('ifpKR00', function(header: IfpHeader, anim: any){
    anim.type = 'R00';

    this
        .repeat('frames', anim.countFrames, function(){
            this
                .ext.tvector4('rotation')
                .float('time');
        });
});

Corrode.addExtension('ifpKRT0', function(header: IfpHeader, anim: any){
    anim.type = 'RT0';

    this
        .repeat('frames', anim.countFrames, function(){
            this
                .ext.tvector4('rotation')
                .ext.tvector3('translation')
                .float('time')
        });
});

Corrode.addExtension('ifpKRTS', function(header: IfpHeader, anim: any){
    anim.type = 'RTS';

    this
        .repeat('frames', anim.countFrames, function(){
            this
                .ext.tvector4('rotation')
                .ext.tvector3('translation')
                .ext.tvector3('scale')
                .float('time')
        });
});
