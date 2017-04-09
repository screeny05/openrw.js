const Corrode = require('corrode');

const hierarchyFlags = {
    SUB_HIERARCHY: 0x01,
    NO_MATRICES: 0x02,
    UPDATE_MODELLING_MATRICES: 0x1000,
    UPDATE_LTMS: 0x2000,
    LOCAL_SPACE_MATRICES: 0x4000
};

const boneFlags = {
    POP_PARENT_MATRIX: 0x01,
    PUSH_PARENT_MATRIX: 0x02,
    UNKNOWN: 0x08
};

Corrode.addExtension('rwsHanimPlg', function(){
    this.vars.__name__ = 'rwsHanimPlg';

    this
        .uint32('version')
        .int32('nodeId')
        .uint32('countNodes')
        .tap(function(){
            if(this.vars.countNodes === 0){
                return;
            }

            this
                .uint32('flags')
                .map.bitmask('flags', hierarchyFlags)
                .uint32('size');

            this.repeat('bones', this.vars.countNodes, function(){
                this
                    .int32('nodeId')
                    .uint32('nodeIndex')
                    .uint32('flags')
                    .map.bitmask('flags', boneFlags);
            });

            throw new TypeError(`not completely implemented https://www.gtamodding.com/wiki/HAnim_PLG_(RW_Section)`);
        })
});
