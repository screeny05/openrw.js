const maps = {
    GTA3_BANK: require('./maps/gta3-bank'),
    GTA3_PAGER: require('./maps/gta3-pager'),
    GTA3_HEADING: require('./maps/gta3-heading'),
};

module.exports = (code, map = maps.GTA3_BANK) => map[code - 0x20];
