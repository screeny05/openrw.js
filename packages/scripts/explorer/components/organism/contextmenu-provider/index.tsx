import * as React from 'react';
import { bind } from 'bind-decorator';
import { Contextmenu } from '../contextmenu';
import { Portal } from './portal';

export class ContextmenuProvider extends React.Component<{ render(): any }> {
    state = {
        isContextMenuOpen: false,
        clickX: 0,
        clickY: 0
    }

    ref: React.RefObject<HTMLDivElement>;

    constructor(props){
        super(props);
        this.ref = React.createRef();
    }

    render(){
        return (
            <div onContextMenu={this.onContextMenu}>
                {this.props.children}
                {this.state.isContextMenuOpen ?
                    <Portal>
                        <div ref={this.ref} onClick={this.onClick}>
                            <Contextmenu x={this.state.clickX} y={this.state.clickY}>{this.props.render()}</Contextmenu>
                        </div>
                    </Portal>
                : ''}
            </div>
        );
    }

    @bind
    onContextMenu(e: React.MouseEvent): void {
        e.preventDefault();
        document.body.addEventListener('click', this.onBodyClick);
        document.body.addEventListener('contextmenu', this.onBodyContextMenu);
        document.body.addEventListener('keydown', this.onBodyKeydown);
        this.setState({
            isContextMenuOpen: true,
            clickX: e.clientX,
            clickY: e.clientY
        });
    }

    @bind
    onClick(): void {
        this.closeMenu();
    }

    @bind
    onBodyClick(e: MouseEvent): void {
        if(!this.ref.current || !e.target || this.ref.current.contains(e.target as Node)){
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();
    }

    @bind
    onBodyContextMenu(e: MouseEvent): void {
        this.closeMenu();
    }

    @bind
    onBodyKeydown(e: KeyboardEvent): void {
        if(e.keyCode === 27){
            this.closeMenu();
        }
    }

    closeMenu(): void {
        this.setState({ isContextMenuOpen: false });
        document.body.removeEventListener('contextmenu', this.onBodyContextMenu);
        document.body.removeEventListener('click', this.onBodyClick);
    }
}
