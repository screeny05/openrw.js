import Corrode from 'corrode';

Corrode.prototype.throw = function(err){
    console.error(err);
    this.emit('error', err);
    throw err;
};
