const Corrode_ = require('corrode');

const MAX_WATERLEVELS = 48;
const OFFSET_ZONES = MAX_WATERLEVELS * 4 + 4;
const OFFSET_LEVELS = OFFSET_ZONES + MAX_WATERLEVELS * 4 * 4;

Corrode_.addExtension('waterpro', function(){
    this
        .uint32('count')
        .repeat('levels', 'count', function(){
            this
                .float('level')
                .map.push('level');
        })
        .position(OFFSET_ZONES)
        .repeat('zones', 'count', function(){
            this
                .float('startX')
                .float('endX')
                .float('startY')
                .float('endY')
        })
        .position(OFFSET_LEVELS)
        .repeat('visibleLevels', 64 * 64, function(){
            const { levels } = this.varStack.peek();
            this
                .pointer('level', levels, 'uint8')
                .map.push('level');
        })
        .repeat('physicalLevels', 128 * 128, function(){
            const { levels } = this.varStack.peek();
            this
                .pointer('level', levels, 'uint8')
                .map.push('level');
        });
});
