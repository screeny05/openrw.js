const path = require('path');
const fs = require('fs');

const Corrode = require('corrode');
const config = require('./config.json');

require('./lib/parsers');

const parser = new Corrode();


// test gxt read
/*parser
    .ext.gxt('gxt')
    .map.push('gxt');
const filePath = path.join(config.paths.base, config.paths.gxt, config.language + '.gxt');*/

// test rws read
parser
    .ext.rws('rws')
    .map.push('rws');
const filePath = path.join(config.paths.base, 'asuka.dff');
//const filePath = path.join(config.paths.base, 'newramp2.dff');

// test dir read
/*parser
    .ext.dir('dir')
    .map.push('dir');
const filePath = path.join(config.paths.base, 'models/gta3.dir');

const fstream = fs.createReadStream(filePath);
fstream.pipe(parser);
parser.on('finish', () => {
    const parser2 = new Corrode();
    parser2.ext.img('img', parser.vars, 'asuka.dff').debug();
    const fstream2 = fs.createReadStream(path.join(config.paths.base, 'models/gta3.img'));
    fstream2.pipe(parser2);
    parser2.on('finish', () => { fs.writeFileSync(path.join(config.paths.base,'asuka.dff'),parser2.vars.img)});
});*/

parser.debug();
const fstream = fs.createReadStream(filePath);
fstream.pipe(parser);
parser.on('finish', () => {
    //console.log(parser.vars[0].data.frameList);
});
