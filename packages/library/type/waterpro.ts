export interface WaterproZones {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}

export interface Waterpro {
    count: number;
    levels: number[];
    zones: WaterproZones[];
    visibleLevels: (number|undefined)[];
    physicalLevels: (number|undefined)[];
}
