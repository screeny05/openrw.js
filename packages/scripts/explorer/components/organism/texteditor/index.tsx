import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/nord.css';
import 'codemirror/theme/neat.css';
import '../../../library/codemirror-modes';
import './index.scss';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog.js';

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
                        theme: 'nord',
                        lineNumbers: true,
                        readOnly: true,
                        dragDrop: false,
                        extraKeys: {
                            'Alt-F': 'findPersistent'
                        }
                    }}
                    onBeforeChange={() => {}}/>
            </div>
        );
    }
}
