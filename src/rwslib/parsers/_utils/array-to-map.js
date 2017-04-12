const Corrode = require('corrode');

/**
 * map an array to an object (map)
 * @param  {string} name                target-name
 * @param  {string} [keyName='key']     name of the key-property
 * @param  {string|Array}               name/array of names of the value-property. if omitted, the full object will be used
 * @param  {string} [src=name]          name of the source-var
 * @return array                        { [keyName]: [keyValue] }
 */
Corrode.MAPPERS.arrayToMap = function(name, keyName = 'key', valueName, src = name){
    const map = {};
    this.vars[src].forEach(entry => {
        if(typeof map[entry[keyName]] !== 'undefined'){
            throw new Error(`Error mapping array to map. Duplicate entry for key '${entry[keyName]}'`)
        }

        let mappedValue = valueName ? entry[valueName] : entry;
        return map[entry[keyName]] = mappedValue;
    });
    this.vars[name] = map;
};
