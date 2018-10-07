import * as React from 'react';
import logger from '@rws/logger';
import { Reporter, ReportItem, reporters } from '@rws/logger';

interface ConsoleEntry {
    timestamp: Date;
    scope: string;
    level: string;
    items: ReportItem[];
}

interface ConsoleState {
    entries: ConsoleEntry[];
}

export class Console extends React.Component<any, ConsoleState> implements Reporter {
    state: ConsoleState = {
        entries: []
    }

    componentDidMount(){
        reporters.push(this);
    }

    componentWillUnmount(){
        reporters.pop();
    }

    render(){
        return (
            <ul className="console">
                {this.state.entries.map(entry =>
                    <li key={entry.timestamp.getTime()}>
                        {`[${entry.scope}][${entry.level}] ${entry.items.join(' ')}`}
                    </li>
                )}
            </ul>
        );
    }

    log(scope: string, level: string, items: ReportItem[]): void {
        this.setState({
            entries: [
                ...this.state.entries,
                {
                    timestamp: new Date(),
                    scope,
                    level,
                    items
                }
            ]
        });
    }
}
