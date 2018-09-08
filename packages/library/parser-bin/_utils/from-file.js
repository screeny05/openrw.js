import Corrode from 'corrode';

Corrode.prototype.parseFile = async function(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            this.end(reader.result);
        };

        reader.onabort = reject;
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
        this.on('finish', () => resolve(this.vars));
        this.on('error', e => reject(e));
    });
};
