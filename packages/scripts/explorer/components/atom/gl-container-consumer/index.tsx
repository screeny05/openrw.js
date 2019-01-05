import * as React from 'react';
import bind from 'bind-decorator';

interface Props {
    glContainer: any;
    children: React.ComponentType<State>;
    onShow?: () => void;
    onHide?: () => void;
}

interface State {
    width: number;
    height: number;
}

export class AtomGlContainerConsumer extends React.Component<Props, State> {
    state: State = {
        width: 0,
        height: 0
    };

    render(){
        return React.createElement(this.props.children, this.state);
    }

    componentDidMount(){
        this.setStateBasedOnGlContainer();
        this.props.glContainer.on('resize', this.onResize);

        if(typeof this.props.onShow === 'function'){
            this.props.glContainer.on('show', this.props.onShow);
        }
        if(typeof this.props.onHide === 'function'){
            this.props.glContainer.on('hide', this.props.onHide);
        }
    }

    componentWillUnmount(){
        this.props.glContainer.off('resize', this.onResize);
        if(typeof this.props.onShow === 'function'){
            this.props.glContainer.off('show', this.props.onShow);
        }
        if(typeof this.props.onHide === 'function'){
            this.props.glContainer.off('hide', this.props.onHide);
        }
    }

    @bind
    onResize(): void {
        this.setStateBasedOnGlContainer();
    }

    setStateBasedOnGlContainer(): void {
        const { width, height } = this.props.glContainer;

        this.setState({
            width,
            height
        });
    }
}
