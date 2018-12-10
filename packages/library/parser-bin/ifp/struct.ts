import Corrode from 'corrode';

Corrode.addExtension('ifpStruct', function(expectedIdentifier?: string|string[], ...args: any[]){
    this
        .ext.ifpHeader('header')
        .tap(function(){
            const { header } = this.vars
            const { identifier } = header;

            const isMatchingIdString = typeof expectedIdentifier === 'string' && identifier === expectedIdentifier;
            const isMatchingIdArray = Array.isArray(expectedIdentifier) && expectedIdentifier.includes(identifier);

            if(expectedIdentifier && !(isMatchingIdString || isMatchingIdArray)){
                this.varStack.popAll()
                console.log(this.varStack.value);
                this.throw(new TypeError(`Expected IFP-Section of type ${expectedIdentifier}, found ${identifier} instead. At position: 0x${(this.streamOffset - 8).toString(16)}\nHeader:\n${JSON.stringify(header)}`));
            }

            if(identifier === 'ANPK'){
                this.ext.ifpStruct('data', 'INFO', 'TAnimation');
            } else if(identifier === 'INFO'){
                this.ext.ifpInfo('data', header, ...args);
            } else if(identifier === 'NAME'){
                this.ext.ifpString('data');
            } else if(identifier === 'DGAN'){
                this.ext.ifpStruct('data', 'INFO', 'CPAN');
            } else if(identifier === 'CPAN'){
                this.ext.ifpStruct('data', 'ANIM');
            } else if(identifier === 'ANIM'){
                this.ext.ifpAnim('data', header);
            } else if(identifier === 'KR00'){
                this.ext.ifpKR00('data', header, ...args);
            } else if(identifier === 'KRT0'){
                this.ext.ifpKRT0('data', header, ...args);
            } else if(identifier === 'KRTS'){
                this.ext.ifpKRTS('data', header, ...args);
            } else {
                console.log('unimplemented struct', identifier, header);
                this.skip(header.size);
            }

            this.map.push('data');
        })
});
