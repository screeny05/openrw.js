import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { Texteditor } from '../../components/organism/texteditor';

interface FileTexteditorProps {
    node: TreeviewNodeProps;
}

interface FileTexteditorState {
    isLoaded: boolean;
    buffer?: ArrayBuffer;
}

export class FileTexteditor extends React.Component<FileTexteditorProps> {
    state: FileTexteditorState = {
        isLoaded: false
    }

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        this.setState({
            isLoaded: true,
            buffer: await treeviewnodeToBuffer(this.props.node)
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }
        if(!this.state.buffer){
            return <div>file could not be loaded</div>;
        }

        return (
            <Texteditor value={new Buffer(this.state.buffer).toString('utf8')}/>
        );
    }
}
