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

import GoldenLayout from 'golden-layout';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';

import 'setimmediate';
import 'regenerator-runtime/runtime';
import '@rws/library/rws-struct-pool';

import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';

import './index.scss';

import { Treeview } from './components/organism/treeview';
import { Console } from './components/organism/console';
import { FilePicker } from './components/organism/file-picker';
import { WelcomeScreen } from './components/organism/welcome-screen';
import { Filetree } from './views/filetree';
import { TreeviewNodeProps } from './components/molecule/treenode';
import { FileHexeditor } from './views/file-hexeditor';
import { FileTexteditor } from './views/file-texteditor';
import { Viewers } from './components/organism/treeview/node-icon';
import { FileDffViewer } from './views/file-dff-viewer';
import { FileInspector } from './views/file-inspector';
import { FileTxdViewer } from './views/file-txd-viewer';
import { FileGxtViewer } from './views/file-gxt-viewer';
import { FileAudioPlayer } from './views/file-audio-player';
import { RawIndex } from '@rws/library/index/raw';
import { SdtEntry } from '@rws/library/type/sdt-entry';
import { BufferBuilder } from './library/buffer-builder';
import { FileWaterproViewer } from './views/file-waterpro-viewer';
import { FileAnimationViewer } from './views/file-animation-viewer';
import { FileZoneViewer } from './views/file-zone-viewer';
import { downloadBuffer } from './library/download-buffer';
import { treeviewnodeToBuffer } from './library/treeviewnode-to-buffer';
import { FileImageViewer } from './views/file-image-viewer';

const $content = document.querySelector('.js--content');

export interface FileComponentProps {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
}

const getComponentConfig = (component: string, title: string, props: FileComponentProps, isReact: boolean): GoldenLayout.ReactComponentConfig|GoldenLayout.ComponentConfig => {
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

const downloadNodeImg = async (node: TreeviewNodeProps): Promise<void> => {
    if(!node.data.img){
        return;
    }

    const buffer = await treeviewnodeToBuffer(node);
    if(buffer){
        downloadBuffer(node.name, buffer);
    }
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
        .string('RIFF')
        .uint32(entry.size + 36)
        .string('WAVE')
        .string('fmt ')
        .uint32(16)
        .uint16(1)
        .uint16(1)
        .uint32(entry.samples)
        .uint32(entry.samples * 2)
        .uint16(2)
        .uint16(16)
        .string('data')
        .uint32(entry.size)
        .buffer(data);

    downloadBuffer(node.name + '.wav', bb.target.buffer as ArrayBuffer);
};

const openFile = (node: TreeviewNodeProps, index: BrowserFileIndex, preferViewer?: string) => {
    let component = Viewers.HexEditor[0];
    let isReact = true;

    if(preferViewer){
        component = preferViewer;
    } else if(node.meta.viewer.length > 0) {
        component = node.meta.viewer[0][0];
    } else {
        component = Viewers.HexEditor[0];
    }

    if(component === Viewers.DffViewer[0]){
        isReact = false;
    }

    if(component === Viewers.ImgExtract[0]){
        return downloadNodeImg(node);
    }

    if(component === Viewers.RawExtract[0]){
        return downloadNodeRaw(node);
    }

    content.root.getItemsById('working-stack')[0].addChild(getComponentConfig(component, node.name, { node, index }, isReact));
};

const initializeOnFiles = async (files: File[]) => {
    const index = new BrowserFileIndex(files);
    await index.load();

    const workingStackDefault: GoldenLayout.ContentItem = <any>content.createContentItem({
        type: 'component',
        componentName: 'working-stack-background',
        id: 'working-stack-default',
        isClosable: false
    });

    content.root.getItemsById('working-stack')[0].addChild(workingStackDefault);
    content.root.getItemsById('initial-file-picker')[0].remove();

    const oldWorkspace = content.root.getItemsById('workspace')[0];
    const newWorkspace: GoldenLayout.ContentItem = <any>content.createContentItem({
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
            title: 'Files',
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
            }]
        }]
    }],
    settings: {
        showPopoutIcon: false,
    },
    dimensions: {
        borderWidth: 1,
        headerHeight: 30
    }
}, $content!);

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
content.registerComponent('file-waterpro-viewer', FileWaterproViewer);
content.registerComponent('file-animation-viewer', FileAnimationViewer);
content.registerComponent('file-zone-viewer', FileZoneViewer);
content.registerComponent('file-image-viewer', FileImageViewer);
content.registerComponent('console', Console);
content.registerComponent('welcome-screen', WelcomeScreen);
content.registerComponent('working-stack-background', function(container: GoldenLayout.Container){
    container.on('tab', () => container.tab.element.hide());
});
content.init();

if(module.hot){
    /* hmr is sadly restricted to reloading the content, due to GL */
    module.hot.dispose(() => content.destroy());
}
