import * as React from 'react';
import { Hexeditor } from '../../components/organism/hexeditor';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';

interface FileHexeditorProps {
    node: TreeviewNodeProps;
    glContainer: any;
}

interface FileHexeditorState {
    buffer?: ArrayBuffer;
    isLoaded: boolean;
    height: number;
}

export class FileHexeditor extends React.Component<FileHexeditorProps, FileHexeditorState> {
    state: FileHexeditorState = {
        isLoaded: false,
        height: 0,
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

    componentWillMount(){
        this.props.glContainer.on('resize', () => this.setState({
            height: this.props.glContainer.height
        }));
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen/>
        }
        if(!this.state.buffer){
            return <div>unable to load</div>;
        }

        return (
            <div>
                <Hexeditor buffer={this.state.buffer} height={this.state.height}/>
            </div>
        );
    }
}
