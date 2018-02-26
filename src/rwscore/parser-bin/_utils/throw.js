import Corrode from 'corrode';

Corrode.prototype.throw = function(err){
    this.emit('error', err);
    throw err;
};
