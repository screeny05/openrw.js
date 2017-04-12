const Corrode = require('corrode');

const sectionTypes = require('./section-types');

Corrode.addExtension('rwsExtension', function(header){
    this.vars.__name__ = 'rwsExtension';

    if(header.size === 0){
        return;
    }

    const startOffset = this.streamOffset;
    const endOffset = startOffset + header.size;

    this.loop('sections', function(end, discard, i){
        this
            .ext.rwsSection('section')
            .tap(function(){
                if(this.streamOffset >= endOffset){
                    end();
                }
            })
            .map.push('section');
    });
});
