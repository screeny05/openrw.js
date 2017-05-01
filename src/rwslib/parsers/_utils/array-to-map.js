const Corrode = require('corrode');
const deepEqual = require('deep-eql');

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
        const mappedValue = valueName ? entry[valueName] : entry;

        if(typeof map[entry[keyName]] !== 'undefined' && !deepEqual(mappedValue, map[entry[keyName]])){
            throw new Error(`Error mapping array to map. Duplicate entry for key '${entry[keyName]}'\n${JSON.stringify(map[entry[keyName]])}\n${JSON.stringify(mappedValue)}`);
        }

        return map[entry[keyName]] = mappedValue;
    });
    this.vars[name] = map;
};
