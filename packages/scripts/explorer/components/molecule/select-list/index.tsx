import * as React from 'react';
import { FixedSizeList as List } from 'react-window';
import { AtomGlContainerConsumer } from '../../atom/gl-container-consumer';

interface Selectable {
    name: string;
}

interface Props {
    glContainer: any;
    width: string|number;
    heightAdd?: number;
    items: Selectable[];
    onSelect: (item: Selectable) => void;
}

interface State {
    selected?: Selectable;
}

export class MoleculeSelectList extends React.Component<Props, State> {
    state: State = {};

    render(){
        return (
            <ul style={{
            }} className="menu vertical">
                <AtomGlContainerConsumer glContainer={this.props.glContainer}>
                    {({ height }) => (
                        <List width={this.props.width} height={height + (this.props.heightAdd || 0)} itemCount={this.props.items.length} itemSize={39}>
                            {({ index, style }) => {
                                const item = this.props.items[index];
                                return (
                                    <li style={style} className={this.state.selected === item ? 'is-active' : ''}>
                                        <a href="#" onClick={this.onItemClick.bind(this, item)}>{item.name}</a>
                                    </li>
                                );
                            }}
                        </List>
                    )}
                </AtomGlContainerConsumer>

            </ul>
        );
    }

    onItemClick(item: Selectable, e: React.MouseEvent): void {
        e.preventDefault();
        this.props.onSelect(item);
        this.setState({ selected: item });
    }
}
