import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

export class Portal extends PureComponent {
    state = {
        canRender: false
    };
    container: HTMLDivElement;

    componentDidMount(){
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.setState({
            canRender: true
        });
    }

    componentWillUnmount(){
        document.body.removeChild(this.container);
    }

    render(){
        return (
            this.state.canRender && createPortal(this.props.children, this.container)
        );
    }
}
