const Corrode = require('corrode');

import { mat3 } from 'gl-matrix';

Corrode.addExtension('tmatrix', function(){
    this
        .ext.nativeArray('mat3', Float32Array, 9)
        .map.push('mat3');
});
