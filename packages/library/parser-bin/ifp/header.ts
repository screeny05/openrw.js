import Corrode from 'corrode';

export interface IfpHeader {
    identifier: string;
    size: number;
}

Corrode.addExtension('ifpHeader', function(){
    this
        .string('identifier', 4)
        .uint32('size')
});
