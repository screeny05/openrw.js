const Corrode = require('corrode');

Corrode.MAPPERS.trimNull = function(name, src = name){
    this.vars[name] = this.vars[src].split('\x00')[0];
};
