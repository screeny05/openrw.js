import Corrode from 'corrode';

const IFP_STRING_BYTE_ALIGN = 4;

Corrode.addExtension('ifpString', function(){
    this
        .terminatedString('string')
        .tap(function(){
            const alreadyRead = this.vars.string.length + 1;
            const paddingRemaining = IFP_STRING_BYTE_ALIGN - ((alreadyRead - 1) % 4 + 1);
            this.skip(paddingRemaining);
        })
        .map.push('string');
});
