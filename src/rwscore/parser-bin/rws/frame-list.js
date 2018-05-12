const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsFrameList', function(){
    this.ext.rwsSection('section', sectionTypes.RW_DATA, function(header){
        this.vars.__name__ = 'rwsFrameList';

        this
            .uint32('countFrames')
            .repeat('frames', 'countFrames', function(end, discard, i){
                this.id = i;
                this
                    .ext.tmatrix('rotation')
                    .ext.tvector3('position')
                    .int32('parentFrameId')
                    .skip(4)
            })
            // @TODO move extension into its respective frame
            .repeat('extensions', 'countFrames', function(){
                this
                    .ext.rwsSection('section', sectionTypes.RW_EXTENSION)
                    .map.push('section');
            });
    }).map.push('section');
});
