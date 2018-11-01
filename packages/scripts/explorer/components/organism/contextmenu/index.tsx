import * as React from 'react';
import './index.scss';

interface ContextmenuProps {
    x: number;
    y: number;
}

export const Contextmenu: React.StatelessComponent<ContextmenuProps> = props =>
    <div className="contextmenu" style={{ top: props.y, left: props.x }}>
        {props.children}
    </div>
