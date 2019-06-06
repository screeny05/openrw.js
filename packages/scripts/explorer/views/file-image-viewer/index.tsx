import * as React from 'react';
import { TreeviewNodeProps } from '../../components/molecule/treenode';
import { BrowserFile } from '@rws/platform-fs-browser/file';
import { BrowserFileIndex } from '@rws/platform-fs-browser/file-index';
import { MoleculeLoadingScreen } from '../../components/molecule/loading-screen';
import { AtomCheckeredBackground } from '../../components/atom/checkered-background';
import { OrganismImageViewer } from '../../components/organism/image-viewer';

interface State {
    isLoaded: boolean;
    image?: HTMLImageElement;
}

interface Props {
    node: TreeviewNodeProps;
    index: BrowserFileIndex;
    glContainer: any;
}

export class FileImageViewer extends React.Component<Props, State> {
    state: State = {
        isLoaded: false,
    };

    constructor(props){
        super(props);
        this.init();
    }

    init(){
        const file: BrowserFile = this.props.node.data.file;
        const target = new Image();
        const reader = new FileReader();
        reader.onload = () => {
            target.src = reader.result as string;
            this.setState({
                isLoaded: true,
                image: target
            });
        }
        reader.readAsDataURL(file.file);
    }

    render(){
        if(!this.state.isLoaded){
            return <MoleculeLoadingScreen title="Loading..."/>
        }
        if(!this.state.image){
            return <div>unable to load image</div>;
        }

        return (
            <div>
                <OrganismImageViewer image={this.state.image}/>
            </div>
        );
    }
}
