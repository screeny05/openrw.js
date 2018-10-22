import * as React from 'react';
import { bind } from 'bind-decorator';
import { Treeview } from '../../components/organism/treeview';
import { TreeviewNodeProps, TreeviewNodeCollection } from '../../components/molecule/treenode';
import memoizeOne from 'memoize-one';
import { guessFolderNodeType, guessFileNodeType, getIconByNodeType, PathNodeType, isExpandableType } from '../../components/organism/treeview/node-icon';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { Icon } from '../../components/atom/icon';
import { ImgIndex } from '@rws/library/index/img';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { RawIndex } from '@rws/library/index/raw';
import { RwsTextureDictionary } from '@rws/library/type/rws';
import Corrode from '@rws/library/node_modules/corrode';
import { DirEntry } from '@rws/library/type/dir-entry';

interface FiletreeState {
    nodes: TreeviewNodeCollection;
    index: BrowserFileIndex;
    isLoaded: boolean;
}

interface FiletreeProps {
    files: File[];
    openFile: (node: TreeviewNodeProps, index: BrowserFileIndex) => void;
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

            let currentNode: TreeviewNodeProps = { children: root, name: '' };
            path.forEach((part, i) => {
                if(!currentNode.children[part]){
                    currentNode.children[part] = {
                        name: part,
                        children: {},
                        icon: this.getFileIconByNodeType(guessFolderNodeType(part)),
                        isExpandable: true,
                        isLoaded: true,
                        data: { path: fullPath.slice(0, i + 1) }
                    };
                }
                currentNode = currentNode.children[part];
            });

            const fileType = guessFileNodeType(file.name);
            const isLoadable = isExpandableType(fileType);

            currentNode.children[file.name] = {
                name: file.name,
                icon: this.getFileIconByNodeType(fileType),
                children: {},
                isExpandable: isLoadable,
                isLoaded: !isLoadable,
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
                {this.state.isLoaded ? <Treeview nodes={this.state.nodes} onNodeOpen={this.onNodeClick} onNodeRequestContent={this.onNodeRequestContent}/> : ''}
            </div>
        )
    }

    @bind
    onNodeClick(node: TreeviewNodeProps): void {
        this.props.openFile(node, this.state.index);
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
        if(nodeType === PathNodeType.FileTxd){
            children = await this.requestContentTxdFile(node);
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
            const type = guessFileNodeType(imgEntry.name);
            const isLoadable = isExpandableType(type);

            return {
                name: imgEntry.name,
                icon: this.getFileIconByNodeType(type),
                isExpandable: isLoadable,
                isLoaded: !isLoadable,
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
        const index = new RawIndex(this.state.index, file.path);
        await index.load();
        return index.sdtIndex.map((sdtEntry, i) => ({
            name: i.toString(),
            icon: this.getFileIconByNodeType(PathNodeType.FileRaw),
            isLoaded: true,
            children: {},
            data: {
                index,
                sdtEntry
            }
        }));
    }

    async requestContentTxdFile(node: TreeviewNodeProps): Promise<TreeviewNodeProps[]> {
        const file: BrowserFile|undefined = node.data.file;
        const entry: DirEntry|undefined = node.data.entry;

        let data: RwsTextureDictionary|null = null;
        if(file){
            const parser = new Corrode().ext.rwsSingle('rws').map.push('rws');
            data = await file.parse<RwsTextureDictionary>(parser);
        }
        if(entry){
            const img: ImgIndex = node.data.img;
            data = await img.parseEntryAsRws(entry) as RwsTextureDictionary;
        }

        if(!data){
            return [];
        }

        return data.textures.map(texture => ({
            name: texture.name,
            icon: this.getFileIconByNodeType(PathNodeType.FileTxd),
            isLoaded: true,
            children: {},
            data: { texture }
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

    getFileIconByNodeType(type: PathNodeType): JSX.Element {
        const icon = getIconByNodeType(type);
        return <Icon font={icon[0]} name={icon[1]}/>
    }
}
