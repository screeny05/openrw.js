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

import './index.scss';

import { Treeview } from './components/organism/treeview';
import { Console } from './components/organism/console';
import { Toolbar } from './components/organism/toolbar';
import { FilePicker } from './components/organism/file-picker';
import { WelcomeScreen } from './components/organism/welcome-screen';


const $toolbar = document.querySelector('.js--toolbar');
const $content = document.querySelector('.js--content');

const initializeOnFiles = (files: File[]) => {
    content.root.getItemsById('working-stack')[0].addChild({
        type: 'react-component',
        component: 'welcome-screen',
        title: 'Welcome'
    });
    content.root.getItemsById('initial-file-picker')[0].remove();

    const oldWorkspace = content.root.getItemsById('workspace')[0];
    const newWorkspace: GoldenLayoutType.ContentItem = <any>content.createContentItem({
        type: 'row',
        id: 'workspace'
    });
    newWorkspace.isInitialised = true;

    newWorkspace.addChild({
        type: 'react-component',
        component: 'treeview',
        props: { files }
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
                height: 20
            }]
        }]
    }],
    settings: {
        showPopoutIcon: false,
    },
}, $content);

content.registerComponent('treeview', Treeview);
content.registerComponent('file-picker', FilePicker);
content.registerComponent('console', Console);
content.registerComponent('welcome-screen', WelcomeScreen);
content.init();

ReactDOM.render(React.createElement(Toolbar), $toolbar);

module.hot.dispose(function(){
    content.destroy();
});
