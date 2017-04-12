const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const BIN_MESH_PLG_HEADER_SIZE = 12;
const BIN_MESH_PLG_ENTRY_SIZE = 8;

const GEOMETRY_PEEK_COUNT = 6;

Corrode.addExtension('rwsBinMeshPlg', function(header){
    this.vars.__name__ = 'rwsBinMeshPlg';

    this
        .uint32('splitMode')
        .assert.includes('splitMode', [0, 1])
        .uint32('countSplits')
        .uint32('countIndices');

    this.tap(function(){
        this.vars.hasData = header.size > BIN_MESH_PLG_HEADER_SIZE + this.vars.countSplits * BIN_MESH_PLG_ENTRY_SIZE;
    });

    this.repeat('splits', 'countSplits', function(){
        this.vars.__name__ = 'rwsBinaryMesh';

        this
            .int32('countIndices')
            .int32('materialIndex');

        this.tap(function(){
            const geometry = this.varStack.peek(GEOMETRY_PEEK_COUNT);

            if(geometry.__name__ !== 'rwsGeometry'){
                throw new ReferenceError(`can't find geometry from rwsBinMeshPlg`);
            }

            const materialList = geometry.materialList.materials;
            Object.defineProperty(this.vars, 'material', {
                get: () => materialList[this.vars.materialIndex]
            });
            this.vars.mode = this.varStack.peek().splitMode;
        });

        if(!this.varStack.peek().hasData){
            return;
        }

        this.repeat('indices', 'countIndices', function(){
            this
                .uint32('index')
                .map.push('index');
        });
    });
});
