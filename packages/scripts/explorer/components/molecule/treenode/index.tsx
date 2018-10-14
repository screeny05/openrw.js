import * as React from 'react';
import { bind } from 'bind-decorator';
import { Icon } from '../../atom/icon';
import { Spinner } from '../spinner';

import './index.scss';

export type TreeviewNodeCollection = {
    [key: string]: TreeviewNodeProps;
};

export interface TreeviewNodeProps {
    name: string;
    icon?: JSX.Element;
    children: TreeviewNodeCollection;
    data?: any;
    level?: number;
    startExpanded?: boolean;
    isExpandable?: boolean;
    isLoaded?: boolean;
    onOpenContent?(node: TreeviewNodeProps): void;
    onRequestContent?(node: TreeviewNodeProps);
}

const TREENODE_INDENT = 15;

export class TreeviewNode extends React.PureComponent<TreeviewNodeProps> {
    state = {
        isExpanded: false,
        isLoading: false,
    }

    constructor(props){
        super(props);
        if(this.props.startExpanded){
            this.state.isExpanded = true;
        }
    }

    render(){
        return (
            <div className="treenode">
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        );
    }

    renderHeader(){
        const paddingLeft = this.getLevel() * TREENODE_INDENT;

        return (
            <div className="treenode__header" onClick={this.onClickHeader} style={{ paddingLeft }}>
                {this.props.isExpandable ? <div className="treenode__expander">
                    <Icon font="fas" name={this.state.isExpanded ? 'caret-down' : 'caret-right'}/>
                </div> : ''}

                {this.props.icon ? <div className="treenode__icon">
                    {this.props.icon}
                </div> : ''}

                <div className="treenode__title">
                    {this.props.name}
                </div>
            </div>
        );
    }

    renderBody(){
        if(!this.state.isExpanded){
            return;
        }

        if(this.state.isLoading && !this.props.isLoaded){
            return (
                <div className="treenode__loader" style={{ paddingLeft: this.getLevel() * TREENODE_INDENT }}>
                    <Spinner/>
                </div>
            )
        }

        return (
            <div className="treenode__body">
                {Object.keys(this.props.children).map((key: string) =>
                    <TreeviewNode
                        key={key}
                        {...this.props.children[key]}
                        level={this.getLevel() + 1}
                        onOpenContent={this.props.onOpenContent}
                        onRequestContent={this.props.onRequestContent}/>
                )}
            </div>
        );
    }

    getLevel(): number {
        return typeof this.props.level === 'number' ? this.props.level : 0;
    }

    @bind
    onClickHeader(): void {
        if(!this.props.isLoaded && typeof this.props.onRequestContent === 'function'){
            if(this.state.isLoading){
                return;
            }
            this.setState({
                isLoading: true,
                isExpanded: true
            });
            return this.props.onRequestContent(this.props);
        }
        if(this.props.isExpandable){
            this.setState({ isExpanded: !this.state.isExpanded });
        } else if(typeof this.props.onOpenContent === 'function') {
            this.props.onOpenContent(this.props);
        }
    }
}
