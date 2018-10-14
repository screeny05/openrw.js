import * as React from 'react';
import { Hexeditor } from '../../components/organism/hexeditor';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';

interface FileHexeditorProps {
    node: TreeviewNodeProps;
}

interface FileHexeditorState {
    buffer?: ArrayBuffer;
    isLoaded: boolean;
}

export class FileHexeditor extends React.Component<FileHexeditorProps, FileHexeditorState> {
    state: FileHexeditorState = {
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
            return <div>loading</div>;
        }
        if(!this.state.buffer){
            return <div>unable to loade</div>;
        }

        return (
            <div>
                <Hexeditor buffer={this.state.buffer}/>
            </div>
        );
    }
}
