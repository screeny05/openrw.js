const Corrode = require('corrode');

import { vec2, vec3 } from 'gl-matrix';

Corrode.addExtension('tvector3', function(rws){
    this
        .float('x')
        .float('y')
        .float('z')

        .tap(function(){
            this.vars.vec3 = vec3.fromValues(this.vars.x, this.vars.y, this.vars.z);
        })
        .map.push('vec3');
});

Corrode.addExtension('tvector2', function(rws){
    this
        .float('x')
        .float('y')

        .tap(function(){
            this.vars.vec2 = vec2.fromValues(this.vars.x, this.vars.y);
        })
        .map.push('vec2');
});
