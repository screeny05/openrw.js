import * as React from 'react';
import { bind } from 'bind-decorator';
import { Treeview } from '../../components/organism/treeview';
import { TreeviewNodeProps, TreeviewNodeCollection } from '../../components/molecule/treenode';
import memoizeOne from 'memoize-one';
import { guessFileNodeType, PathNodeType, getFolderMeta, getFileMeta, Viewers } from '../../components/organism/treeview/node-icon';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { ImgIndex } from '@rws/library/index/img';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { RawIndex } from '@rws/library/index/raw';

interface FiletreeState {
    nodes: TreeviewNodeCollection;
    index: BrowserFileIndex;
    isLoaded: boolean;
}

interface FiletreeProps {
    files: File[];
    openFile: (node: TreeviewNodeProps, index: BrowserFileIndex, preferViewer?: string) => void;
    glContainer: any;
}

const splitPath = (path: string): string[] => path.split(/[\\\/]/).slice(1);

export class Filetree extends React.Component<FiletreeProps, FiletreeState> {
    constructor(props: FiletreeProps){
        super(props);
        this.state = {
            nodes: this.getFiletreeFromFiles(this.props.files),
            index: new BrowserFileIndex(this.props.files),
            isLoaded: false
        };
        this.init();
    }

    async init(): Promise<void> {
        await this.state.index.load();
        this.setState({
            isLoaded: true
        });
    }

    componentDidMount(){
        setTimeout(() => this.props.glContainer.setSize(window.innerWidth * 0.25, 100), 0);
    }

    getFiletreeFromFiles = memoizeOne((files: File[]): TreeviewNodeCollection => {
        const root: TreeviewNodeCollection = {};

        files.forEach(file => {
            const fullPath = splitPath(file.webkitRelativePath);
            // remove root & filename
            const path = fullPath.slice(0, -1);

            let currentNode: TreeviewNodeProps = { children: root, name: '', meta: getFolderMeta('root') };
            path.forEach((part, i) => {
                if(!currentNode.children[part]){
                    const meta = getFolderMeta(part);
                    currentNode.children[part] = {
                        name: part,
                        children: {},
                        meta: meta,
                        isExpandable: true,
                        isLoaded: true,
                        data: {
                            path: fullPath.slice(0, i + 1),
                            isFolder: true
                        }
                    };
                }
                currentNode = currentNode.children[part];
            });

            const meta = getFileMeta(file.name);

            currentNode.children[file.name] = {
                name: file.name,
                meta: meta,
                children: {},
                isExpandable: !!meta.isExpandable,
                isLoaded: !meta.isExpandable,
                data: {
                    file: new BrowserFile(file),
                    path: fullPath
                }
            };
        });

        return root;
    });

    render(){
        return (
            <div className="filetree">
                {this.state.isLoaded ?
                    <Treeview nodes={this.state.nodes} onNodeOpen={this.onNodeClick} onNodeRequestContent={this.onNodeRequestContent} renderContextMenu={this.renderContextMenu}/>
                : ''}
            </div>
        )
    }

    @bind
    onNodeClick(node: TreeviewNodeProps): void {
        this.props.openFile(node, this.state.index);
    }

    @bind
    renderContextMenu(node: TreeviewNodeProps): any {
        const availableViewers: string[][] = [...node.meta.viewer];

        if(node.data.raw){
            availableViewers.push(Viewers.RawExtract);
        }
        if(node.data.img){
            availableViewers.push(Viewers.ImgExtract);
        }
        if(!node.data.isFolder){
            availableViewers.push(Viewers.HexEditor);
        }

        return (
            <div>
                {node.data.isFolder ?
                    <div className="contextmenu__item contextmenu__item--disabled" key="expand" onClick={() => {}}>{node.name}</div>
                : ''}
                {availableViewers.map(([viewer, title]) =>
                    <div className="contextmenu__item" key={viewer} onClick={() => this.props.openFile(node, this.state.index, viewer)}>{title}</div>
                )}
            </div>
        );
    }

    @bind
    async onNodeRequestContent(node: TreeviewNodeProps): Promise<void> {
        const nodeType = guessFileNodeType(node.name);
        let children: null|TreeviewNodeProps[] = null;
        if(nodeType === PathNodeType.FileImg){
            children = await this.requestContentImg(node.data.file);
        }
        if(nodeType === PathNodeType.FileRaw){
            children = await this.requestContentRaw(node.data.file);
        }

        if(!children){
            return;
        }

        this.setState({
            nodes: this.addChildren(node.data.path, children)
        });
    }

    async requestContentImg(file: BrowserFile): Promise<TreeviewNodeProps[]> {
        const index = new ImgIndex(this.state.index, file.path);
        await index.load();

        return Array.from(index.imgIndex.values()).map(imgEntry => {
            const meta = getFileMeta(imgEntry.name);

            return {
                name: imgEntry.name,
                meta: meta,
                isExpandable: !!meta.isExpandable,
                isLoaded: !meta.isExpandable,
                children: {},
                data: {
                    img: index,
                    entry: imgEntry,
                    path: splitPath(index.imgFile.path + '/' + imgEntry.name),
                }
            };
        });
    }

    async requestContentRaw(file: BrowserFile): Promise<TreeviewNodeProps[]> {
        const raw = new RawIndex(this.state.index, file.path);
        await raw.load();
        const meta = getFileMeta('0.rawentry');
        return raw.sdtIndex.map((sdtEntry, i) => ({
            name: `${i}.rawentry`,
            meta: meta,
            isLoaded: true,
            children: {},
            data: {
                raw,
                sdtEntry
            }
        }));
    }

    addChildren(path: string[], children: TreeviewNodeProps[], setLoaded: boolean = true): TreeviewNodeCollection {
        let lastNode: TreeviewNodeProps = { children: this.state.nodes } as any;
        const mappedNodes: TreeviewNodeProps[] = path.map(part => {
            const node = lastNode.children[part];
            lastNode = node;
            return node;
        });
        mappedNodes.unshift({ children: this.state.nodes } as any);

        lastNode = {
            ...lastNode,
            isLoaded: setLoaded,
            children: {
                ...lastNode.children,
            }
        };

        mappedNodes[mappedNodes.length - 1] = lastNode;
        children.forEach(child => lastNode.children[child.name] = child);

        mappedNodes.pop();
        mappedNodes.reverse().forEach(node => {
            node = {
                ...node,
                children: {
                    ...node.children,
                    [lastNode.name]: lastNode
                }
            };
            lastNode = node;
            return node;
        });

        return lastNode.children;
    }
}
