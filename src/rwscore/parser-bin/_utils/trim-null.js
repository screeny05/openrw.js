const Corrode = require('corrode');

const TRIM_REGEX = /^\u0000*(.*?)\u0000*$/g;

Corrode.MAPPERS.trimNull = function(name, src = name){
    this.vars[name] = this.vars[src].replace(TRIM_REGEX, '$1');
};
