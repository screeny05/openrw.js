import * as React from 'react';
import { Icon } from '../../atom/icon';

import './index.scss';

export class Spinner extends React.Component {
    render(){
        return (
            <div className="spinner">
                <Icon font="fas" name="spinner"/>
            </div>
        );
    }
}
