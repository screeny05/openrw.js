import Corrode from 'corrode';

import './anim';
import './header';
import './info';
import './string';
import { IfpInfo } from './info';
import { IfpTAnimation } from './anim';

export type IfpAnpk = IfpInfo<IfpTAnimation>;

Corrode.addExtension('ifp', function(){
    this
        .ext.ifpStruct('data', 'ANPK')
        .map.push('data');
});
