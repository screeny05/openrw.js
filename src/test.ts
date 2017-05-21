var path = require('path');
var fs = require('fs');
var Corrode = require('corrode');
var config = require('../config.json');
require('./rwslib/parsers');
var parser = new Corrode();
// test gxt read
/*parser
    .ext.gxt('gxt')
    .map.push('gxt');
const filePath = path.join(config.root, config.paths.gxt, config.language + '.gxt');*/
// test rws read
parser
    .ext.rws('rws')
    .map.push('rws');
const filePath = path.join(config.rootPath, 'asuka.dff');
//const filePath = path.join(config.rootPath, 'models/frontend.txd');
// test dir read
/*parser
    .ext.dir('dir')
    .map.push('dir');
const filePath = path.join(config.root, 'models/gta3.dir');

const fstream = fs.createReadStream(filePath);
fstream.pipe(parser);
parser.on('finish', () => {
    const parser2 = new Corrode();
    parser2.ext.img('img', parser.vars, 'asuka.dff').debug();
    const fstream2 = fs.createReadStream(path.join(config.root, 'models/gta3.img'));
    fstream2.pipe(parser2);
    parser2.on('finish', () => { fs.writeFileSync(path.join(config.root,'asuka.dff'),parser2.vars.img)});
});*/
var fstream = fs.createReadStream(filePath);
fstream.pipe(parser);
parser.debug();
parser.on('finish', function () {
    //console.log(JSON.stringify(parser.vars));
    //console.log(parser.vars[0].data.frameList);
});
