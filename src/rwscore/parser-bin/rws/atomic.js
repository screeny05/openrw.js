const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const CLUMP_PEEK_COUNT = 5;

const GEOMETRY_AS_ATOMIC_CHILD_VERSION = 0x30400;

const atomicFlags = {
    atomicCollisionTest: 0x01,
    atomicRender: 0x04
};

Corrode.addExtension('rwsAtomic', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsAtomic';

        this.int32('frameIndex');

        if(header.version.version >= GEOMETRY_AS_ATOMIC_CHILD_VERSION){
            this.int32('geometryIndex');
        }

        this.uint32('flags')
            .map.bitmask('flags', atomicFlags)
            .uint32('unknown')

        this.tap(function(){
            const clump = this.varStack.peek(CLUMP_PEEK_COUNT);

            if(clump.__name__ !== 'rwsClump'){
                throw new ReferenceError(`can't find clump from rwsAtomic`);
            }

            Object.defineProperty(this.vars, 'frame', {
                value: clump.frameList.frames[this.vars.frameIndex],
                enumerable: false
            });

            if(header.version.version >= GEOMETRY_AS_ATOMIC_CHILD_VERSION){
                Object.defineProperty(this.vars, 'geometry', {
                    value: clump.geometryList.geometries[this.vars.geometryIndex],
                    enumerable: false
                });
            }
        });

        if(header.version.version < GEOMETRY_AS_ATOMIC_CHILD_VERSION){
            this.ext.rwsSection('geometry', sectionTypes.RW_GEOMETRY);
        }

        this.ext.rwsSection('extension', sectionTypes.RW_EXTENSION);
    }).map.push('section');
});
