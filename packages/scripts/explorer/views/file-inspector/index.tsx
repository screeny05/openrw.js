import * as React from 'react';
import { ObjectInspector, TableInspector } from 'react-inspector';
import Corrode from '@rws/library/node_modules/corrode';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { guessFileNodeType, PathNodeType } from '../../components/organism/treeview/node-icon';
import './index.scss';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { DirEntry } from '@rws/library/type/dir-entry';
import { ImgIndex } from '@rws/library/index/img';

interface FileInspectorState {
    isLoaded: boolean;
    useTable: boolean;
    data?: any;
}

interface FileInspectorProps {
    node: TreeviewNodeProps;
}

export class FileInspector extends React.Component<FileInspectorProps, FileInspectorState> {
    state: FileInspectorState = {
        isLoaded: false,
        useTable: false,
    }

    constructor(props){
        super(props);
        this.init();
    }

    async init(){
        const file: BrowserFile|undefined = this.props.node.data.file;
        const entry: DirEntry|undefined = this.props.node.data.entry;

        let useTable = false;
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
        if(entry && type === PathNodeType.FileIfp){
            const img: ImgIndex = this.props.node.data.img;
            const parser = new Corrode().ext.ifp('ifp').map.push('ifp');
            data = await img.imgFile.parse(parser, entry.offset, entry.offset + entry.size);
        }
        if(file && type === PathNodeType.FileDir){
            const parser = new Corrode().ext.dir('rws').map.push('rws');
            data = await file.parse(parser);
            useTable = true;
        }
        if(file && type === PathNodeType.FileDir){
            const parser = new Corrode().ext.dir('dir').map.push('dir');
            data = await file.parse(parser);
            useTable = true;
        }
        if(file && type === PathNodeType.FileGxt){
            const parser = new Corrode().ext.gxt('gxt').map.push('gxt');
            data = await file.parse(parser);
            useTable = true;
        }
        if(file && type === PathNodeType.FileWaterpro){
            const parser = new Corrode().ext.waterpro('waterpro').map.push('waterpro');
            data = await file.parse(parser);
        }
        if(file && type === PathNodeType.FileIfp){
            const parser = new Corrode().ext.ifp('ifp').map.push('ifp');
            data = await file.parse(parser);
        }
        console.log(data);

        this.setState({
            isLoaded: true,
            data,
            useTable
        });
    }

    render(){
        if(!this.state.isLoaded){
            return <div>loading...</div>;
        }
        if(!this.state.data){
            return <div>unsupported type <code>{PathNodeType[guessFileNodeType(this.props.node.name)]}</code></div>;
        }

        return (
            <div className="file-inspector">
                {this.state.useTable ?
                    <TableInspector data={this.state.data} theme="chromeDark" expandLevel={1}/>
                    :
                    <ObjectInspector data={this.state.data} theme="chromeDark" expandLevel={1}/>
                }
            </div>
        );
    }
}
