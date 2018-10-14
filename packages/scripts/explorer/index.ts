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
import { guessFileNodeType, isTextFileType } from './components/organism/treeview/node-icon';


const $toolbar = document.querySelector('.js--toolbar');
const $content = document.querySelector('.js--content');

const openFile = async (node: TreeviewNodeProps) => {
    let component = 'file-hexeditor';
    const type = guessFileNodeType(node.name);
    if(isTextFileType(type)){
        component = 'file-texteditor';
    }

    content.root.getItemsById('working-stack')[0].addChild({
        type: 'react-component',
        component,
        props: { node },
        title: node.name
    });
};

const initializeOnFiles = async (files: File[]) => {
    const index = new BrowserFileIndex(files);
    await index.load();

    const workingStackDefault: GoldenLayoutType.ContentItem = <any>content.createContentItem({
        type: 'react-component',
        component: 'welcome-screen',
        title: 'Welcome',
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
        type: 'react-component',
        component: 'filetree',
        isClosable: false,
        props: { files, index, openFile }
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
            width: 80,
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
content.registerComponent('file-texteditor', FileTexteditor);
content.registerComponent('console', Console);
content.registerComponent('welcome-screen', WelcomeScreen);
content.init();

ReactDOM.render(React.createElement(Toolbar), $toolbar);

module.hot.dispose(function(){
    content.destroy();
});
