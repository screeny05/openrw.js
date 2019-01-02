import * as React from 'react';
import bind from 'bind-decorator';

interface Props {
    glContainer: any;
    children: React.ComponentType<State>;
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
    }

    componentWillUnmount(){
        this.props.glContainer.off('resize', this.onResize);
    }

    @bind
    onResize(){
        this.setStateBasedOnGlContainer();
    }

    setStateBasedOnGlContainer(){
        const { width, height } = this.props.glContainer;

        this.setState({
            width,
            height
        });
    }
}
