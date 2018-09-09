const sectionTypes = {
    RW_DATA: 0x01,
    RW_STRING: 0x02,
    RW_EXTENSION: 0x03,
    RW_CAMERA: 0x05,
    RW_TEXTURE: 0x06,
    RW_MATERIAL: 0x07,
    RW_MATERIAL_LIST: 0x08,
    RW_ATOMIC_SECTION: 0x09,
    RW_PLANE_SECTION: 0x0a,
    RW_WORLD: 0x0b,
    RW_SPLINE: 0x0c,
    RW_MATRIX: 0x0d,
    RW_FRAME_LIST: 0x0e,
    RW_GEOMETRY: 0x0f,
    RW_CLUMP: 0x10,
    RW_LIGHT: 0x12,
    RW_ATOMIC: 0x14,
    RW_TEXTURE_NATIVE: 0x15,
    RW_TEXTURE_DICTIONARY: 0x16,
    RW_ANIMATION_DATABASE: 0x17,
    RW_IMAGE: 0x18,
    RW_SKIN_ANIMATION: 0x19,
    RW_GEOMETRY_LIST: 0x1a,
    RW_ANIM_ANIMATION: 0x1B,
    RW_TEAM: 0x1C,
    RW_CROWD: 0x1D,
    RW_DELTA_MORPH_ANIMATION: 0x1E,
    RW_RIGHT_TO_RENDER: 0x1f,
    RW_MULTITEXTURE_EFFECT_NATIVE: 0x20,
    RW_MULTITEXTURE_EFFECT_DICTIONARY: 0x21,
    RW_TEAM_DICTIONARY: 0x22,
    RW_PLATFORM_INDEPENDENT_TEXTURE_DICTIONARY: 0x23,
    RW_TABLE_OF_CONTENTS: 0x24,
    RW_PARTICLE_STANDARD_GLOBAL_DATA: 0x25,
    RW_ALTPIPE: 0x26,
    RW_PLATFORM_INDEPENDENT_PEDS: 0x27,
    RW_PATCH_MESH: 0x28,
    RW_CHUNK_GROUP_START: 0x29,
    RW_CHUNK_GROUP_END: 0x2A,
    RW_UV_ANIMATION_DICTIONARY: 0x2B,
    RW_COLL_TREE: 0x2C,

    RW_MORPH_PLG: 0x0105,
    RW_SKY_MIPMAP: 0x0110,
    RW_SKIN_PLG: 0x0116,
    RW_PARTICLES_PLG: 0x0118,
    RW_H_ANIM_PLG: 0x011e,
    RW_MATERIAL_EFFECTS_PLG: 0x0120,
    RW_ANISOTROPY_PLG: 0x0127,
    RW_UV_ANIMATION_PLG: 0x0135,

    RW_BIN_MESH_PLG: 0x050e,
    RW_NATIVE_DATA_PLG: 0x0510,

    RW_ATOMIC_VISIBILITY_DISTANCE: 0x0253F200,
    RW_CLUMP_VISIBILITY_DISTANCE: 0x0253F201,
    RW_FRAME_VISIBILITY_DISTANCE: 0x0253F202,
    RW_PIPELINE_SET: 0x0253F2F3,
    RW_TEXDICTIONARY_LINK: 0x0253F2F5,
    RW_SPECULAR_MATERIAL: 0x0253F2F6,
    RW_2D_EFFECT: 0x0253F2F8,
    RW_EXTRA_VERT_COLOUR: 0x0253F2F9,
    RW_COLLISION_MODEL: 0x0253F2FA,
    RW_GTA_H_ANIM: 0x0253F2FB,
    RW_REFLECTION_MATERIAL: 0x0253F2FC,
    RW_BREAKABLE: 0x0253F2FD,
    RW_FRAME: 0x0253f2fe,

    getNameByType: type => Object.keys(sectionTypes).find(key => sectionTypes[key] === type) || `0x${type.toString(16)}`
};

module.exports = sectionTypes;