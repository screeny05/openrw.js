import * as React from 'react';
import { printable } from 'unicoderegexp';
import VirtualList from 'react-tiny-virtual-list';
import './index.scss';

const ROW_SIZE = 16;

interface HexeditorProps {
    buffer: ArrayBuffer;
    height: number;
}

interface HexeditorSlice {
    hex: string;
    address: string;
    ascii: string;
}

export class Hexeditor extends React.PureComponent<HexeditorProps> {
    getSlice(buffer: ArrayBuffer, i: number): HexeditorSlice {
        const subBuffer = buffer.slice(i * ROW_SIZE, (i + 1) * ROW_SIZE);
        const highestAddress = buffer.byteLength.toString(16);
        const slice = Array.from(new Uint8Array(subBuffer));

        return {
            address: (i * ROW_SIZE).toString(16).padStart(highestAddress.length, '0'),
            hex: slice.map(byte => byte.toString(16).padStart(2, '0')).join(' '),
            ascii: this.getAscii(slice)
        };
    }

    getAscii(chars: number[]): string {
        return chars.map(charNumber => {
            const char = String.fromCharCode(charNumber);
            return printable.test(char) ? char : '.';
        }).join('');
    }

    render(){
        const rows = Math.ceil(this.props.buffer.byteLength / 16);

        return (
            <div className="hexeditor">
                <VirtualList width='100%' height={this.props.height} overscanCount={20} itemCount={rows} itemSize={24} renderItem={({index, style}) => {
                    const slice = this.getSlice(this.props.buffer, index);
                    return (
                        <div key={index} style={style} className="hexeditor__row">
                            <div className="hexeditor__address">
                                {slice.address}
                            </div>
                            <div className="hexeditor__hex">
                                {slice.hex}
                            </div>
                            <div className="hexeditor__ascii">
                                {slice.ascii}
                            </div>
                        </div>
                    );
                }}/>
            </div>
        );
    }
}
