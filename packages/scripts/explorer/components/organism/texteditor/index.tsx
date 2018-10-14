import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';
import '../../../library/codemirror-modes';
import './index.scss';

interface TexteditorProps {
    value: string;
}

export class Texteditor extends React.Component<TexteditorProps> {
    render(){
        return (
            <div className="texteditor">
                <CodeMirror
                    value={this.props.value}
                    options={{
                        theme: 'material',
                        lineNumbers: true,
                        readOnly: true,
                        dragDrop: false,
                    }}
                    onBeforeChange={() => {}}/>
            </div>
        );
    }
}
