import { GLES2Context } from '@glaced/gles2-2.0';

export function getGlErrorCodeName(gl: GLES2Context, code: number): string|null {
    const name = Object.keys(gl).find(key => gl[key] === code);
    if(!name){
        return null;
    }

    return 'GL_' + name;
}

export function getGlDebugProxy(gl: GLES2Context, options = { enableLogging: false, sanityCheck: true }): GLES2Context {
    return new Proxy(gl, {
        get(gl, key){
            const fn = gl[key];
            if(typeof fn !== 'function') return fn;

            return function glErrorProxy(){
                const retval = fn.apply(gl, arguments);

                if(options.sanityCheck){
                    Array.from(arguments).forEach((arg, i) => {
                        if(typeof arg === 'number' && (Number.isNaN(arg) || !Number.isFinite(arg)) || typeof arg === 'undefined'){
                            console.warn('glDebugProxy Sanity fail: gl.' + key.toString(), `argument #${i} not sane:`, arg);
                        }
                    });
                }

                if(options.enableLogging){
                    console.log(`call gl.${key}(`, ...Array.from(arguments), ')', retval ? '\n' : '', retval);
                }

                const err = gl.getError();
                if(err !== gl.NO_ERROR){
                    const errorName = getGlErrorCodeName(gl, err);
                    throw new Error(
                        `GL ERROR: 0x${err.toString(16)} while calling ${key} (${errorName})\n` +
                        `https://duckduckgo.com/?q=!ducky+${encodeURIComponent(key.toString())}+${errorName ? encodeURIComponent(errorName) : ''}`
                    );
                }
                return retval;
            }
        }
    });
}
