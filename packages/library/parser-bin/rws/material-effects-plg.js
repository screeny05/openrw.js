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

const blendModes = {
    NO: 0x00,
    ZERO: 0x01,
    ONE: 0x02,
    SRC_COLOR: 0x03,
    INV_SRC_COLOR: 0x04,
    SRC_ALPHA: 0x05,
    INV_SRC_ALPHA: 0x06,
    DEST_ALPHA: 0x07,
    INV_DEST_ALPHA: 0x08,
    DEST_COLOR: 0x09,
    INV_DEST_COLOR: 0x0A,
    SRC_ALPHA_SAT: 0x0B,
};

Corrode.addExtension('rwsMaterialEffectsPlg', function(header){
    this.vars.__name__ = 'rwsMaterialEffectsPlg';

    this.uint32('type');

    this.tap(function(){
        if(this.vars.type === materialEffectTypes.BUMP_MAP){
            this.ext.rwsMaterialEffectsPlgBumpMap('effect');

        } else if(this.vars.type === materialEffectTypes.ENV_MAP){
            this.ext.rwsMaterialEffectsPlgEnvMap('effect');

        } else if(this.vars.type === materialEffectTypes.DUAL){
            this.ext.rwsMaterialEffectsPlgDual('effect');

        } else if(this.vars.type === materialEffectTypes.UV_TRANSFORM){
            this.ext.rwsMaterialEffectsPlgUvTransform('effect');

        } else if(this.vars.type === materialEffectTypes.BUMP_ENV_MAP){
            this.ext.rwsMaterialEffectsPlgBumpMap('effect');
            this.ext.rwsMaterialEffectsPlgEnvMap('effect');

        } else if(this.vars.type === materialEffectTypes.DUAL_UV_TRANSFORM){
            this.ext.rwsMaterialEffectsPlgDual('effect');
            this.ext.rwsMaterialEffectsPlgUvTransform('effect');
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgBumpMap', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgBumpMap';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.BUMP_MAP)
        .float('intensity')
        .uint32('containsBumpMap');

    this.tap(function(){
        if(this.vars.containsBumpMap){
            this.ext.rwsTexture('bumpMap');
        }
    });

    this.uint32('containsHeightMap');

    this.tap(function(){
        if(this.vars.containsHeightMap){
            this.ext.rwsTexture('heightMap');
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgEnvMap', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgEnvMap';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.ENV_MAP)
        .float('reflectionCoefficient')
        .uint32('useFrameBufferAlpha')
        .uint32('containsEnvironmentMap');

    this.tap(function(){
        if(this.vars.containsEnvironmentMap){
            this.ext.rwsTexture('environmentMap');
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgDual', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgDual';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.DUAL)
        .int32('srcBlendMode')
        .int32('destBlendMode')
        .uint32('containsTexture');

    this.tap(function(){
        if(this.vars.containsTexture){
            this.ext.rwsTexture('texture');
        }
    });
});

Corrode.addExtension('rwsMaterialEffectsPlgUvTransform', function(){
    this.vars.__name__ = 'rwsMaterialEffectsPlgUvTransform';

    this
        .uint32('identifier')
        .assert.equal('identifier', materialEffectTypes.UV_TRANSFORM);
});
