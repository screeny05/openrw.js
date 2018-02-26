import Corrode from 'corrode';

Corrode.prototype.asPromised = function(data){
    return new Promise((resolve, reject) => {
        this.on('finish', () => resolve(this.vars));
        this.on('error', reject);

        if(data){
            this.end(data);
        }
    });
};
