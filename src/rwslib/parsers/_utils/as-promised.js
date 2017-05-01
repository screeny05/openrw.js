import * as Corrode from 'corrode';

Corrode.prototype.asPromised = function(){
    return new Promise((resolve, reject) => {
        this.on('finish', () => resolve(this.vars));
        this.on('error', reject);
    });
};
