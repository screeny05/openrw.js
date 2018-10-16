import * as React from 'react';
import { bind } from 'bind-decorator';
import { TreeviewNode, TreeviewNodeProps, TreeviewNodeCollection } from '../../molecule/treenode';
import './index.scss';

interface TreeviewProps {
    nodes: TreeviewNodeCollection;
    onNodeOpen?(node: TreeviewNodeProps): void;
    onNodeRequestContent?(node: TreeviewNodeProps);
}

export class Treeview extends React.PureComponent<TreeviewProps> {
    render(){
        return (
            <div className="treeview">
                {Object.keys(this.props.nodes).map(key =>
                    <TreeviewNode
                        key={key}
                        {...this.props.nodes[key]}
                        onOpenContent={this.onNodeClick}
                        onRequestContent={this.onNodeRequestContent}/>
                )}
            </div>
        )
    }

    @bind
    onNodeClick(node: TreeviewNodeProps): void {
        if(typeof this.props.onNodeOpen === 'function'){
            this.props.onNodeOpen(node);
        }
    }

    @bind
    onNodeRequestContent(node: TreeviewNodeProps): void {
        if(typeof this.props.onNodeRequestContent === 'function'){
            this.props.onNodeRequestContent(node);
        }
    }
}
