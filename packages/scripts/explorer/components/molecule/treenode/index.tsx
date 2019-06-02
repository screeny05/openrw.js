import * as React from 'react';
import { bind } from 'bind-decorator';
import { Icon } from '../../atom/icon';
import { Spinner } from '../spinner';

import './index.scss';
import { Contextmenu } from '../../organism/contextmenu';
import { ContextmenuProvider } from '../../organism/contextmenu-provider';
import { FileMeta } from '../../organism/treeview/node-icon';

export type TreeviewNodeCollection = {
    [key: string]: TreeviewNodeProps;
};

export interface TreeviewNodeProps {
    name: string;
    children: TreeviewNodeCollection;
    data?: any;
    meta: FileMeta;
    level?: number;
    startExpanded?: boolean;
    isExpandable?: boolean;
    isLoaded?: boolean;
    onOpenContent?(node: TreeviewNodeProps): void;
    onRequestContent?(node: TreeviewNodeProps): void;
    renderContextMenu?(node: TreeviewNodeProps): void;
}

const TREENODE_INDENT = 15;

const RenderlessContainer: React.StatelessComponent = props => props.children as any;

const OptionalContextProvider: React.StatelessComponent<{ renderContextMenu?(node: TreeviewNodeProps): any, node: TreeviewNodeProps }> = ({ children, renderContextMenu, node }) => typeof renderContextMenu === 'function' ?
    <ContextmenuProvider render={() => renderContextMenu(node)}>
        {children}
    </ContextmenuProvider> :
    <RenderlessContainer>{children}</RenderlessContainer>
    ;

export class TreeviewNode extends React.PureComponent<TreeviewNodeProps> {
    state = {
        isExpanded: false,
        isLoading: false
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
            <OptionalContextProvider renderContextMenu={this.props.renderContextMenu} node={this.props}>
                <div className="treenode__header" onClick={this.onClickHeader} style={{ paddingLeft }}>
                    {this.props.isExpandable ?
                        <div className="treenode__expander">
                            <Icon font="fas" name={this.state.isExpanded ? 'caret-down' : 'caret-right'}/>
                        </div>
                    : ''}

                    {this.renderIcon()}

                    <div className="treenode__title">
                        {this.props.name}
                    </div>
                </div>
            </OptionalContextProvider>
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
                        onRequestContent={this.props.onRequestContent}
                        renderContextMenu={this.props.renderContextMenu}/>
                )}
            </div>
        );
    }

    renderIcon(){
        const icon = this.props.meta.icon.length === 2 ? this.props.meta.icon[this.state.isExpanded ? 1 : 0] : this.props.meta.icon;
        return (
            <div className="treenode__icon">
                <Icon font={icon[0]} name={icon[1]}/>
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
