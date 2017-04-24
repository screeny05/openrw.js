const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsSection', function(expectedSectionType, dataCallback){
    this.vars.__name__ = 'rwsSection';

    if(typeof expectedSectionType === 'function' && !dataCallback){
        dataCallback = expectedSectionType;
        expectedSectionType = null;
    }

    this
        .ext.rwsHeader('header')
        .tap(function(){
            const { header } = this.vars;
            const { type } = header;
            const predictedEndOffset = this.streamOffset + header.size;

            if(expectedSectionType && type !== expectedSectionType){
                console.log(this.varStack.stack);
                throw new TypeError(`Expected RWS-Section of type ${expectedSectionType}, found ${type} instead. At position: ${this.streamOffset - 12}\nHeader:\n${JSON.stringify(header)}`);
            }

            if(type === sectionTypes.RW_DATA){
                if(!dataCallback){
                    throw new Error(`Encountered data section, while no callback was provided.\nHeader:\n${JSON.stringify(header)}`);
                }
                this.tap('data', () => dataCallback.call(this, header));

            } else if(type === sectionTypes.RW_CLUMP){
                this.ext.rwsClump('data', header);

            } else if(type === sectionTypes.RW_FRAME_LIST){
                this.ext.rwsFrameList('data', header);

            } else if(type === sectionTypes.RW_EXTENSION){
                this.ext.rwsExtension('data', header);

            } else if(type === sectionTypes.RW_FRAME){
                this.ext.rwsFrame('data', header);

            } else if(type === sectionTypes.RW_GEOMETRY_LIST){
                this.ext.rwsGeometryList('data', header);

            } else if(type === sectionTypes.RW_GEOMETRY){
                this.ext.rwsGeometry('data', header);

            } else if(type === sectionTypes.RW_MATERIAL_LIST){
                this.ext.rwsMaterialList('data', header);

            } else if(type === sectionTypes.RW_MATERIAL){
                this.ext.rwsMaterial('data', header);

            } else if(type === sectionTypes.RW_TEXTURE){
                this.ext.rwsTexture('data', header);

            } else if(type === sectionTypes.RW_ATOMIC){
                this.ext.rwsAtomic('data', header);


            // PLUGINS
            } else if(type === sectionTypes.RW_H_ANIM_PLG){
                this.ext.rwsHAnimPlg('data', header);

            } else if(type === sectionTypes.RW_BIN_MESH_PLG){
                this.ext.rwsBinMeshPlg('data', header);

            } else if(type === sectionTypes.RW_MORPH_PLG){
                this.ext.rwsMorphPlg('data', header);

            } else if(type === sectionTypes.RW_MATERIAL_EFFECTS_PLG){
                this.ext.rwsMaterialEffectsPlg('data', header);


            // PRIMITIVES
            } else if(type === sectionTypes.RW_STRING){
                this
                    .string('data', header.size)
                    .map.trimNull('data');


            // SKIP
            } else if(type === sectionTypes.RW_SKY_MIPMAP){
                // TODO: ignore?
                this.skip(header.size);
                this.vars.data = {
                    __name__: 'rwsIgnored',
                    type: sectionTypes.getNameByType(header.type)
                };

            } else {
                console.warn('encountered unknown section-type.', sectionTypes.getNameByType(header.type), header, ' using buffer');
                this.buffer('data', header.size);
                //throw new Error(`No Section handler for type ${type}.\nHeader:\n${JSON.stringify(header)}`);
            }

            this.map.push('data');
        });
});
