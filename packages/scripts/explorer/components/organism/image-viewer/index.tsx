import * as React from 'react';
import '../../atom/checkered-background';
import './index.scss';

interface Props {
    image: HTMLImageElement;
}

interface State {

}

export class OrganismImageViewer extends React.Component<Props, State> {
    state: State = {
    };

    render(){
        return (
            <div className='checkered-background image-viewer'>
                <img src={this.props.image.src}/>
            </div>
        );
    }
}
