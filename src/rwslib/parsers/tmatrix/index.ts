const Corrode = require('corrode');

import { mat3 } from 'gl-matrix';

Corrode.addExtension('tmatrix', function(rws){
    this
        .float('m00').float('m01').float('m02')
        .float('m10').float('m11').float('m12')
        .float('m20').float('m21').float('m22');

    this.tap(function(){
        this.vars.mat = mat3.fromValues(
            this.vars.m00, this.vars.m01, this.vars.m02,
            this.vars.m10, this.vars.m11, this.vars.m12,
            this.vars.m20, this.vars.m21, this.vars.m22
        );
    });

    this.map.push('mat');
});
