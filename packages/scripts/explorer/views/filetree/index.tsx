import * as React from 'react';
import { bind } from 'bind-decorator';
import { Treeview } from '../../components/organism/treeview';
import { TreeviewNodeProps, TreeviewNodeCollection } from '../../components/molecule/treenode';
import memoizeOne from 'memoize-one';
import { guessFolderNodeType, guessFileNodeType, getIconByNodeType, PathNodeType } from '../../components/organism/treeview/node-icon';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { Icon } from '../../components/atom/icon';
import { ImgIndex } from '@rws/library/index/img';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';

interface FiletreeState {
    nodes: TreeviewNodeCollection;
    index: BrowserFileIndex;
    isLoaded: boolean;
}

interface FiletreeProps {
    files: File[];
    openFile: (node: TreeviewNodeProps) => void;
}

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

    getFiletreeFromFiles = memoizeOne((files: File[]): TreeviewNodeCollection => {
        const root: TreeviewNodeCollection = {};

        files.forEach(file => {
            const fullPath = file.webkitRelativePath.split(/[\\\/]/).slice(1);
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
            const isLoadable = fileType === PathNodeType.FileImg;

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
        this.props.openFile(node);
    }

    @bind
    async onNodeRequestContent(node: TreeviewNodeProps): Promise<void> {
        const nodeType = guessFileNodeType(node.name);
        let children: null|TreeviewNodeProps[] = null;
        if(nodeType === PathNodeType.FileImg){
            children = await this.requestContentImg(node.data.file);
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
        return Array.from(index.imgIndex.values()).map(imgEntry => ({
            name: imgEntry.name,
            icon: this.getFileIconByNodeType(guessFileNodeType(imgEntry.name)),
            isLoaded: true,
            children: {},
            data: {
                img: index,
                entry: imgEntry
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

    getFileIconByNodeType(type: PathNodeType): JSX.Element {
        const icon = getIconByNodeType(type);
        return <Icon font={icon[0]} name={icon[1]}/>
    }
}
