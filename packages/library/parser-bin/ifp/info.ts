import Corrode from 'corrode';
import { IfpHeader } from './header';

export interface IfpInfo<T = any> {
    countEntries: number;
    name: string;
    entries: T[];
}

Corrode.addExtension('ifpInfo', function(header: IfpHeader, expectedIdentifier: string){
    this
        .int32('countEntries')
        .ext.ifpString('name')
        .repeat('entries', 'countEntries', function(){
            // TAnimation is not a struct
            this
                .ext[expectedIdentifier === 'TAnimation' ? 'TAnimation' : 'ifpStruct']('entry', expectedIdentifier)
                .map.push('entry');
        });
});
