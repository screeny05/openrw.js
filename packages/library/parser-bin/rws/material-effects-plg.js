const Corrode = require('corrode');

const sectionTypes = require('./section-types');

const materialEffectTypes = {
    NULL: 0x00,
    BUMP_MAP: 0x01,
    ENV_MAP: 0x02,
    BUMP_ENV_MAP: 0x03,
    DUAL: 0x04,
    UV_TRANSFORM: 0x05,
    DUAL_UV_TRANSFORM: 0x06
};

Corrode.addExtension('rwsMaterialEffectsPlg', function(header){
    this.vars.__name__ = 'rwsMaterialEffectsPlg';

    this.uint32('type');

    // RwsAtom may contain this plg as extension, but it'll only indicate
    // the type of the used extensions, not contain them.
    if(header.size === 4){
        return;
    }

    this.tap(function(){
        if(this.vars.type === materialEffectTypes.BUMP_MAP){
            this.ext.rwsMaterialEffectsPlgEffectBumpMap('effectBumpMap');
            this.ext.rwsMaterialEffectsPlgEffectNull('effectNull');

        } else if(this.vars.type === materialEffectTypes.ENV_MAP){
            this.ext.rwsMaterialEffectsPlgEffectEnvMap('effectEnvMap');
            this.ext.rwsMaterialEffectsPlgEffectNull('effectNull');

        } else if(this.vars.type === materialEffectTypes.DUAL){
            this.ext.rwsMaterialEffectsPlgEffectDual('effectDual');
            this.ext.rwsMaterialEffectsPlgEffectNull('effectNull');

        } else if(this.vars.type === materialEffectTypes.UV_TRANSFORM){
            this.ext.rwsMaterialEffectsPlgEffectUvTransform('effectUvTransform');
            this.ext.rwsMaterialEffectsPlgEffectNull('effectNull');

        } else if(this.vars.type === materialEffectTypes.BUMP_ENV_MAP){
            this.ext.rwsMaterialEffectsPlgEffectBumpMap('effectBumpMap');
            this.ext.rwsMaterialEffectsPlgEffectEnvMap('effectEnvMap');

        } else if(this.vars.type === materialEffectTypes.DUAL_UV_TRANSFORM){
            this.ext.rwsMaterialEffectsPlgEffectDual('effectDual');
            this.ext.rwsMaterialEffectsPlgEffectUvTransform('effectUvTransform');
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgEffectBumpMap', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEffectBumpMap';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.BUMP_MAP)
        .float('intensity')
        .uint32('containsBumpMap');

    this.tap(function(){
        if(this.vars.containsBumpMap){
            this.ext.rwsSection('bumpMap', sectionTypes.RW_TEXTURE);
        }
    });

    this.uint32('containsHeightMap');

    this.tap(function(){
        if(this.vars.containsHeightMap){
            this.ext.rwsSection('heightMap', sectionTypes.RW_TEXTURE);
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgEffectEnvMap', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEffectEnvMap';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.ENV_MAP)
        .float('reflectionCoefficient')
        .uint32('useFrameBufferAlpha')
        .uint32('containsEnvironmentMap');

    this.tap(function(){
        if(this.vars.containsEnvironmentMap){
            this.ext.rwsSection('environmentMap', sectionTypes.RW_TEXTURE);
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgEffectDual', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEffectDual';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.DUAL)
        .int32('srcBlendMode')
        .int32('destBlendMode')
        .uint32('containsTexture');

    this.tap(function(){
        if(this.vars.containsTexture){
            this.ext.rwsSection('texture', sectionTypes.RW_TEXTURE);
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgEffectUvTransform', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEffectUvTransform';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.UV_TRANSFORM);
});

Corrode.addExtension('rwsMaterialEffectsPlgEffectNull', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEffectNull';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.NULL);
});
