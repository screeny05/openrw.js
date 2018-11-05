import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { GxtEntry } from '@rws/library/type/gxt-entry';
import Corrode from '@rws/library/node_modules/corrode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import VirtualList from 'react-tiny-virtual-list';
import { parse as parseGxtValue, Expression, ExpressionType, buildAst, AstNode } from '@rws/library/parser-text/gxt';

import './index.scss';
import './gxt-value.scss';

interface FileGxtViewerProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileGxtViewerState {
    isLoaded: boolean;
    entries: GxtEntry[];
    height: number;
}

export const GxtValue: React.StatelessComponent<{ value: string, showSource: boolean }> = ({ value, showSource }) => {
    const expressions = parseGxtValue(value);
    const ast = buildAst(expressions);
    const asSource = (val: string) => showSource ? `~${val}~` : val;

    const astNodeToElement = (node: AstNode|AstNode[]|undefined): React.ReactNode => {
        if(!node){
            return;
        }
        if(Array.isArray(node)){
            return node.map(child => astNodeToElement(child));
        }

        if(node.type === ExpressionType.Root){
            return <span key={node.index} className="gxt-value">{astNodeToElement(node.children)}</span>;
        }
        if(node.type === ExpressionType.Style){
            return (
                <span key={node.index} className={`gxt-value__style gxt-value__style--${node.content}`}>
                    {asSource(node.content)}
                    {astNodeToElement(node.children)}
                </span>
            );
        }
        if(node.type === ExpressionType.KeyboardKey){
            return (
                <span key={node.index} className={`gxt-value__key gxt-value__key--${node.children![0].content}`}>
                    {asSource(node.content)}
                    {astNodeToElement(node.children)}
                </span>
            );
        }
        if(node.type === ExpressionType.VariableNumber || node.type === ExpressionType.VariableText){
            return <span key={node.index} className="gxt-value__variable">{asSource(node.content)}</span>;
        }
        if(node.type === ExpressionType.Constant){
            return <span key={node.index} className="gxt-value__constant">{asSource(node.content)}</span>;
        }
        return <span key={node.index} className="gxt-value__text">{node.content}</span>;
    }

    return astNodeToElement(ast) as React.ReactElement<any>;
}

export class FileGxtViewer extends React.Component<FileGxtViewerProps, FileGxtViewerState> {
    state: FileGxtViewerState = {
        isLoaded: false,
        entries: [],
        height: 0,
    }

    constructor(props){
        super(props);
        this.init();
    }

    componentWillMount(){
        this.props.glContainer.on('resize', () => this.setState({
            height: this.props.glContainer.height
        }));
    }

    async init(){
        const file: BrowserFile = this.props.node.data.file;
        const parser = new Corrode().ext.gxt('gxt').map.push('gxt');
        const entries = await file.parse<GxtEntry[]>(parser);

        this.setState({
            isLoaded: true,
            entries,
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }
        if(this.state.entries.length === 0){
            return <div>unable to load gxt</div>;
        }

        return (
            <div className="file-gxt-viewer">
                <VirtualList width='100%' height={this.state.height} overscanCount={20} itemCount={this.state.entries.length} itemSize={16} renderItem={({index, style}) => {
                    const entry = this.state.entries[index];

                    return (
                        <div key={index} style={style} className="file-gxt-viewer__row">
                            <div className="file-gxt-viewer__key">
                                [{entry.key}]
                            </div>
                            <div className="file-gxt-viewer__value">
                                <GxtValue value={entry.value} showSource={true}/>
                            </div>
                        </div>
                    );
                }}/>
            </div>
        );
    }
}
