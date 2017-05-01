const sectionTypes = {
    RW_DATA: 0x01,
    RW_STRING: 0x02,
    RW_EXTENSION: 0x03,
    RW_TEXTURE: 0x06,
    RW_MATERIAL: 0x07,
    RW_MATERIAL_LIST: 0x08,
    RW_FRAME_LIST: 0x0e,
    RW_GEOMETRY: 0x0f,
    RW_CLUMP: 0x10,
    RW_ATOMIC: 0x14,
    RW_GEOMETRY_LIST: 0x1a,
    RW_FRAME: 0x0253f2fe,

    RW_MORPH_PLG: 0x0105,
    RW_SKY_MIPMAP: 0x0110,
    RW_H_ANIM_PLG: 0x011e,
    RW_MATERIAL_EFFECTS_PLG: 0x0120,
    RW_BIN_MESH_PLG: 0x050e,

    getNameByType: type => Object.keys(sectionTypes).find(key => sectionTypes[key] === type) || `0x${type.toString(16)}`
};

module.exports = sectionTypes;
