import * as React from 'react';
import './index.scss';

interface IconProps {
    font: 'fa' | 'fas' | 'fi' | string;
    name: string;
}

export class Icon extends React.PureComponent<IconProps> {
    render(){
        const font = this.props.font;
        const prefix = font === 'fas' ? 'fa' : font;

        return (
            <i className={`icon ${font} ${prefix}--${this.props.name}`}></i>
        );
    }
}
