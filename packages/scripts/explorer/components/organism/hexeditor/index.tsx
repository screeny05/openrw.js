import * as React from 'react';
import './index.scss';
import { printable } from 'unicoderegexp';

const ROW_SIZE = 16;

interface HexeditorProps {
    buffer: ArrayBuffer;
}

export class Hexeditor extends React.Component<HexeditorProps> {
    render(){
        const slices: { hex: string, address: string, ascii: string }[] = [];
        const rows = Math.ceil(this.props.buffer.byteLength / 16);
        const highestAddress = this.props.buffer.byteLength.toString(16);
        for (let i = 0; i < rows; i++) {
            const subBuffer = this.props.buffer.slice(i * ROW_SIZE, (i + 1) * ROW_SIZE);
            const slice = Array.from(new Uint8Array(subBuffer));

            slices.push({
                address: i.toString(16).padStart(highestAddress.length, '0'),
                hex: slice.map(byte => byte.toString(16).padStart(2, '0')).join(' '),
                ascii: this.getAscii(slice)
            })
        }

        return (
            <div className="hexeditor">
                <div className="hexeditor__addresses">
                    {slices.map(slice => [slice.address, <br/>])}
                </div>
                <div className="hexeditor__hex">
                    {slices.map(slice => [slice.hex, <br/>])}
                </div>
                <div className="hexeditor__ascii">
                    {slices.map(slice => [slice.ascii, <br/>])}
                </div>
            </div>
        );
    }

    getAscii(chars: number[]): string {
        return chars.map(charNumber => {
            const char = String.fromCharCode(charNumber);
            return printable.test(char) ? char : '.';
        }).join('');
    }
}
