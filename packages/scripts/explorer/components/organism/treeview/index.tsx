import * as React from 'react';
import memoize from 'memoize-one';
import { bind } from 'bind-decorator';
import { guessFolderNodeType, guessFileNodeType, PathNodeType, getIconByNodeType } from './node-icon';
import './index.scss';
import { Icon } from '../../atom/icon';

interface TreeviewProps {
    files: File[];
}

interface TreeviewState {
    cursor: any;
}

export interface PathNode {
    name: string,
    isFolder: boolean;
    type: PathNodeType;
    children: PathNode[];
}

interface TreeviewNodeProps {
    node: PathNode;
    startExpanded?: boolean;
    level: number;
}

const TREENODE_INDENT = 15;

export class TreeviewNode extends React.PureComponent<TreeviewNodeProps> {
    state = {
        isExpanded: false,
        isExpandable: false,
    }

    constructor(props){
        super(props);
        if(this.props.startExpanded){
            this.state.isExpanded = true;
        }
        if(this.props.node.type === PathNodeType.Folder){
            this.state.isExpandable = true;
        }
    }

    render(){
        const icon = getIconByNodeType(this.props.node.type, this.state.isExpanded);
        const paddingLeft = this.props.level * TREENODE_INDENT;

        return (
            <div className="tree-node">
                <div className="tree-node__header" onClick={this.onClickHeader} style={{ paddingLeft }}>
                    {this.state.isExpandable ? <div className="tree-node__expander">
                        <Icon font="fas" name={this.state.isExpanded ? 'caret-down' : 'caret-right'}/>
                    </div> : ''}
                    <div className="tree-node__icon">
                        <Icon font={icon[0]} name={icon[1]}/>
                    </div>
                    <div className="tree-node__title">
                        {this.props.node.name}
                    </div>
                </div>
                {this.state.isExpanded ? <div className="tree-node__body">
                    {this.props.node.children.map(child => <TreeviewNode key={child.name} node={child} level={this.props.level + 1}/>)}
                </div> : ''}
            </div>
        );
    }

    @bind
    onClickHeader(){
        this.setState({ isExpanded: !this.state.isExpanded });
    }
}

export class Treeview extends React.Component<TreeviewProps, TreeviewState> {
    state: TreeviewState = {
        cursor: null
    }

    transformFileListToTree = memoize((files: File[]) => {
        const paths: PathNode = {
            name: 'root',
            isFolder: true,
            type: PathNodeType.Folder,
            children: []
        };

        const orderChildren = (nodes: PathNode[]): PathNode[] => {
            nodes = nodes.sort((a, b) => {
                if(a.isFolder && !b.isFolder){
                    return 1;
                }
                if(b.isFolder && !a.isFolder){
                    return 0;
                }
                if(a.name < b.name){
                    return -1;
                }
                if(a.name > b.name){
                    return 1;
                }
                return 0;
            });

            nodes.forEach(node => {
                node.children = orderChildren(node.children);
            });

            return nodes;
        };

        files.forEach(file => {
            const pathParts = file.webkitRelativePath.split(/[\\\/]/);
            const folders = pathParts.slice(0, pathParts.length - 1);
            let relativePath = paths;
            folders.forEach(folder => {
                let found = relativePath.children.find(child => child.name === folder);
                if(!found){
                    found = {
                        isFolder: true,
                        name: folder,
                        type: guessFolderNodeType(folder),
                        children: []
                    };
                    relativePath.children.push(found);
                }
                relativePath = found;
            });
            relativePath.children.push({
                name: file.name,
                isFolder: false,
                type: guessFileNodeType(file),
                children: []
            });
        });

        return orderChildren(paths.children);
    });

    render(){
        const data = this.transformFileListToTree(this.props.files);
        return (
            <div className="tree">
                {data.map(node => <TreeviewNode key={node.name} node={node} startExpanded level={0}/>)}
            </div>
        );
    }
}
