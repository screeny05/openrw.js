const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const CLUMP_PEEK_COUNT = 5;

const atomicFlags = {
    atomicCollisionTest: 0x01,
    atomicRender: 0x04
};

Corrode.addExtension('rwsAtomic', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsAtomic';

        this
            .int32('frameIndex')
            .int32('geometryIndex')
            .uint32('flags')
            .map.bitmask('flags', atomicFlags)
            .uint32('unknown')

        this.tap(function(){
            const clump = this.varStack.peek(CLUMP_PEEK_COUNT);

            if(clump.__name__ !== 'rwsClump'){
                throw new ReferenceError(`can't find clump from rwsAtomic`);
            }

            Object.defineProperty(this.vars, 'frame', {
                get: () => clump.frameList.frames[this.vars.frameIndex]
            });

            Object.defineProperty(this.vars, 'geometry', {
                get: () => clump.geometryList.geometries[this.vars.geometryIndex]
            });
        });

        this.ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
