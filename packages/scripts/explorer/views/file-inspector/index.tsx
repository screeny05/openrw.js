import * as React from 'react';
import { ObjectInspector } from 'react-inspector';
import Corrode from '@rws/library/node_modules/corrode';
import { treeviewnodeToBuffer } from '../../library/treeviewnode-to-buffer';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { guessFileNodeType, PathNodeType } from '../../components/organism/treeview/node-icon';
import './index.scss';
import { BrowserFile } from '@rws/platform-fs-browser/';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';

interface FileInspectorState {
    isLoaded: boolean;
    data?: any;
}

interface FileInspectorProps {
    node: TreeviewNodeProps;
}

export class FileInspector extends React.Component<FileInspectorProps, FileInspectorState> {
    state: FileInspectorState = {
        isLoaded: false,
    }

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        const file: BrowserFile|undefined = this.props.node.data.file;
        const entry: DirEntry|undefined = this.props.node.data.entry;

        let data: any = null;
        const type = guessFileNodeType(this.props.node.name);
        const isRws = type === PathNodeType.FileTxd || type === PathNodeType.FileDff;

        if(file && isRws){
            const parser = new Corrode().ext.rwsSingle('rws').map.push('rws');
            data = await file.parse(parser);
        }
        if(entry && isRws){
            const img: ImgIndex = this.props.node.data.img;
            data = await img.parseEntryAsRws(entry);
        }

        this.setState({
            isLoaded: true,
            data
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }
        if(!this.state.data){
            return <div>unsupported data</div>;
        }

        return (
            <div className="file-inspector">
                <ObjectInspector data={this.state.data} theme="chromeDark" expandLevel={1}/>
            </div>
        );
    }
}
