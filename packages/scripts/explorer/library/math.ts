export const MAX_INT16 = 32767;
export const MIN_INT16 = -32768;
export const COUNT_VALUES_UINT16 = 65536;

export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
export const clampInt16 = (val: number) => clamp(val, MIN_INT16, MAX_INT16);
export const signInt16 = (val: number) => val >= MAX_INT16 ? val - COUNT_VALUES_UINT16 : val;
export const uint8ToInt16 = (low: number, high: number) => signInt16(low | (high << 8));
export const int16ToFloat = (int16: number): number => int16 / MAX_INT16;
