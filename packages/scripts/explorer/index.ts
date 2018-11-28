declare global {
    interface Window {
        $: any;
        ReactDOM: any;
        React: any;
    }
}

import $ from 'jquery';
window.$ = $;

import * as ReactDOM from 'react-dom';
window.ReactDOM = ReactDOM;

import * as React from 'react';
window.React = React;

import _GoldenLayout from 'golden-layout';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';
import * as GoldenLayoutType from 'golden-layout';
const GoldenLayout: typeof GoldenLayoutType = _GoldenLayout;

import 'setimmediate';
import 'regenerator-runtime/runtime';
import '@rws/library/rws-struct-pool';

import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';

import './index.scss';

import { Treeview } from './components/organism/treeview';
import { Console } from './components/organism/console';
import { Toolbar } from './components/organism/toolbar';
import { FilePicker } from './components/organism/file-picker';
import { WelcomeScreen } from './components/organism/welcome-screen';
import { Filetree } from './views/filetree';
import { TreeviewNodeProps } from './components/molecule/treenode';
import { FileHexeditor } from './views/file-hexeditor';
import { FileTexteditor } from './views/file-texteditor';
import { guessFileNodeType, isTextFileType, PathNodeType, isInspectableFileType } from './components/organism/treeview/node-icon';
import { FileDffViewer } from './views/file-dff-viewer';
import { FileInspector } from './views/file-inspector';
import { FileTxdViewer } from './views/file-txd-viewer';
import { FileGxtViewer } from './views/file-gxt-viewer';
import { FileAudioPlayer } from './views/file-audio-player';
import { ImgIndex } from '@rws/library/index/img';
import { DirEntry } from '@rws/library/type/dir-entry';
import { RawIndex } from '@rws/library/index/raw';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import { BufferBuilder } from './library/buffer-builder';


const $toolbar = document.querySelector('.js--toolbar');
const $content = document.querySelector('.js--content');

export interface FileComponentProps {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
}

const getComponentConfig = (component: string, title: string, props: FileComponentProps, isReact: boolean): GoldenLayoutType.ReactComponentConfig|GoldenLayoutType.ComponentConfig => {
    if(isReact){
        return {
            type: 'react-component',
            component,
            props,
            title
        };
    }
    return {
        type: 'component',
        componentName: component,
        componentState: props,
        title
    };
};

const downloadBuffer = (name: string, buffer: ArrayBuffer): void => {
    const blob = new Blob([buffer]);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = name;
    link.click();
}

const downloadNodeImg = async (node: TreeviewNodeProps): Promise<void> => {
    if(!node.data.img){
        return;
    }

    const img: ImgIndex = node.data.img;
    const entry: DirEntry = node.data.entry;
    const buffer = await img.imgFile.getData(entry.offset, entry.offset + entry.size);
    downloadBuffer(node.name, buffer);
};

const downloadNodeRaw = async (node: TreeviewNodeProps): Promise<void> => {
    if(!node.data.raw){
        return;
    }

    const raw: RawIndex = node.data.raw;
    const entry: SdtEntry = node.data.sdtEntry;
    const data = await raw.rawFile.getData(entry.offset, entry.offset + entry.size);
    const bb = new BufferBuilder(entry.size + 44);

    bb
        .writeString('RIFF')
        .writeUInt32(entry.size + 36)
        .writeString('WAVE')
        .writeString('fmt ')
        .writeUInt32(16)
        .writeUInt16(1)
        .writeUInt16(1)
        .writeUInt32(entry.samples)
        .writeUInt32(entry.samples * 2)
        .writeUInt16(2)
        .writeUInt16(16)
        .writeString('data')
        .writeUInt32(entry.size)
        .writeBuffer(data);

    downloadBuffer(node.name + '.wav', bb.buffer.buffer as ArrayBuffer);
};

const openFile = (node: TreeviewNodeProps, index: BrowserFileIndex, preferViewer?: string) => {
    let component = 'file-hexeditor';
    let isReact = true;
    const fileType = guessFileNodeType(node.name);

    if(preferViewer){
        component = preferViewer;
    }

    if(!preferViewer && isInspectableFileType(fileType)){
        component = 'file-inspector';
    }
    if(!preferViewer && isTextFileType(fileType)){
        component = 'file-texteditor';
    }
    if(!preferViewer && fileType === PathNodeType.FileDff){
        component = 'file-dff-viewer';
    }
    if(!preferViewer && fileType === PathNodeType.FileTxd){
        component = 'file-txd-viewer';
    }
    if(!preferViewer && fileType === PathNodeType.FileGxt){
        component = 'file-gxt-viewer';
    }
    if(!preferViewer && (fileType === PathNodeType.FileWav || fileType === PathNodeType.FileMp3 || fileType === PathNodeType.FileRawEntry)){
        component = 'file-audio-player';
    }

    if(component === 'file-dff-viewer'){
        isReact = false;
    }

    if(component === 'file-img-extract'){
        return downloadNodeImg(node);
    }

    if(component === 'file-raw-extract'){
        return downloadNodeRaw(node);
    }

    content.root.getItemsById('working-stack')[0].addChild(getComponentConfig(component, node.name, { node, index }, isReact));
};

const initializeOnFiles = async (files: File[]) => {
    const index = new BrowserFileIndex(files);
    await index.load();

    const workingStackDefault: GoldenLayoutType.ContentItem = <any>content.createContentItem({
        type: 'component',
        componentName: 'working-stack-background',
        id: 'working-stack-default',
        isClosable: false
    });

    content.root.getItemsById('working-stack')[0].addChild(workingStackDefault);
    content.root.getItemsById('initial-file-picker')[0].remove();

    const oldWorkspace = content.root.getItemsById('workspace')[0];
    const newWorkspace: GoldenLayoutType.ContentItem = <any>content.createContentItem({
        type: 'row',
        id: 'workspace'
    });
    newWorkspace.isInitialised = true;

    newWorkspace.addChild({
        type: 'stack',
        id: 'left-stack',
        content: [{
            type: 'react-component',
            component: 'filetree',
            isClosable: false,
            props: { files, index, openFile }
        }]
    });
    oldWorkspace.contentItems.forEach(item => newWorkspace.addChild(item));
    oldWorkspace.parent.replaceChild(oldWorkspace, newWorkspace);
};

const content = new GoldenLayout({
    content: [{
        type: 'row',
        id: 'workspace',
        content: [{
            type: 'column',
            content: [{
                type: 'stack',
                id: 'working-stack',
                content: [{
                    type: 'react-component',
                    component: 'file-picker',
                    props: { onChange: initializeOnFiles },
                    id: 'initial-file-picker',
                    isClosable: false,
                    title: 'Select file/folder'
                }]
            }, {
                type: 'react-component',
                component: 'console',
                title: 'Console',
                height: 20,
                isClosable: false
            }]
        }]
    }],
    settings: {
        showPopoutIcon: false,
    },
}, $content);

content.registerComponent('treeview', Treeview);
content.registerComponent('filetree', Filetree);
content.registerComponent('file-picker', FilePicker);
content.registerComponent('file-hexeditor', FileHexeditor);
content.registerComponent('file-dff-viewer', FileDffViewer);
content.registerComponent('file-txd-viewer', FileTxdViewer);
content.registerComponent('file-gxt-viewer', FileGxtViewer);
content.registerComponent('file-audio-player', FileAudioPlayer);
content.registerComponent('file-texteditor', FileTexteditor);
content.registerComponent('file-inspector', FileInspector);
content.registerComponent('console', Console);
content.registerComponent('welcome-screen', WelcomeScreen);
content.registerComponent('working-stack-background', (container: GoldenLayoutType.Container) => {
    container.on('tab', () => container.tab.element.hide());
});
content.init();

ReactDOM.render(React.createElement(Toolbar), $toolbar);

module.hot.dispose(function(){
    content.destroy();
});
