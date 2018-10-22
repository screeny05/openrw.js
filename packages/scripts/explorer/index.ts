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
import { guessFileNodeType, isTextFileType, PathNodeType } from './components/organism/treeview/node-icon';
import { FileDffViewer } from './views/file-dff-viewer';
import { FileInspector } from './views/file-inspector';
import { FileTxdViewer } from './views/file-txd-viewer';


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

const openFile = async (node: TreeviewNodeProps, index: BrowserFileIndex) => {
    let component = 'file-hexeditor';
    let isReact = true;
    const fileType = guessFileNodeType(node.name);
    if(isTextFileType(fileType)){
        component = 'file-texteditor';
    }
    if(fileType === PathNodeType.FileDff){
        isReact = false;
        component = 'file-dff-viewer';
    }
    if(fileType === PathNodeType.FileTxd){
        component = 'file-txd-viewer';
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
