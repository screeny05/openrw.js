import * as React from 'react';
import { FixedSizeList as List } from 'react-window';
import bind from 'bind-decorator';
import { AtomGlContainerConsumer } from '../../atom/gl-container-consumer';
import './index.scss';

interface Selectable {
    name: string;
}

interface Props {
    glContainer: any;
    width?: string|number;
    heightAdd?: number;
    items: Selectable[];
    selected?: Selectable;
    onSelect: (item: Selectable) => void;
}

interface InnerProps {
    width: string|number;
    height: number;
    heightAdd: number;
    items: Selectable[];
    selected?: Selectable;
    onItemClick: (item: Selectable) => void;
}

export class MoleculeSelectListInner extends React.PureComponent<InnerProps> {
    render(){
        return (
            <List
                width={this.props.width}
                height={this.props.height + this.props.heightAdd}
                itemCount={this.props.items.length}
                itemSize={25}
            >
                {({ index, style }) => {
                    /* may be turned into purecomponent, so we don't re-render all items on scroll */
                    const item = this.props.items[index];
                    return (
                        <li style={style} className={item === this.props.selected ? 'is-active' : ''}>
                            <a href="#" className="select-list__link" onClick={this.onItemClick.bind(this, item, index)}>{item.name}</a>
                        </li>
                    );
                }}
            </List>
        );
    }

    onItemClick(item: Selectable, activeIndex: number, e: React.MouseEvent){
        e.preventDefault();
        this.setState({ activeIndex });
        this.props.onItemClick(item);
    }
}

export class MoleculeSelectList extends React.PureComponent<Props> {
    render(){
        return (
            <ul className="menu vertical">
                <AtomGlContainerConsumer glContainer={this.props.glContainer}>
                    {this.getSelectInner}
                </AtomGlContainerConsumer>
            </ul>
        );
    }

    @bind
    onItemClick(item: Selectable): void {
        this.props.onSelect(item);
    }

    @bind
    /** Gets passed to GlConsumer as bound function to prevent recreation of ListInner on render */
    getSelectInner({ height }){
        return <MoleculeSelectListInner
            width={this.props.width || '100%'}
            height={height}
            heightAdd={this.props.heightAdd || 0}
            items={this.props.items}
            onItemClick={this.onItemClick}
            selected={this.props.selected}
        />;
    }
}
