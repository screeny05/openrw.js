import * as React from 'react';
import { ScaleLoader } from 'react-spinners';

interface Props {
    title?: string;
}

export class MoleculeLoadingScreen extends React.Component<Props> {
    render(){
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>
                <ScaleLoader color="#1779ba"/>
                {this.props.title ?
                    <div style={{ fontSize: 22, marginTop: 10 }}>
                        {this.props.title}
                    </div>
                : ''}
            </div>
        );
    }
}
