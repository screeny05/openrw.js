import Corrode from 'corrode';

Corrode.addExtension('nativeArray', function(type, elementCount){
    this
        .buffer('buffer', elementCount * type.BYTES_PER_ELEMENT)
        .tap(function(){
            const buffer: Uint8Array = this.vars.buffer;
            this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
        })
        .map.push('array');
});

Corrode.addExtension('tvector4', function(){
    this
        .ext.nativeArray('vec4', Float32Array, 4)
        .map.push('vec4');
});

Corrode.addExtension('tvector3', function(){
    this
        .ext.nativeArray('vec3', Float32Array, 3)
        .map.push('vec3');
});

Corrode.addExtension('tvector2', function(){
    this
        .ext.nativeArray('vec2', Float32Array, 2)
        .map.push('vec2');
});
