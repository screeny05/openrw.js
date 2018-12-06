import WaveFileType from 'wavefile';
const WaveFile: typeof WaveFileType = require('wavefile/dist/wavefile.umd.js');

const WAV_FORMAT_IMA = 17;

interface WavFmtSubchunk {
    chunkId: 'fmt ';
    chunkSize: number;
    audioFormat: number;
    bitsPerSample: number;
    blockAlign: number;
    byteRate: number;
    cbSize: number;
    dwChannelMask: number;
    numChannels: number;
    sampleRate: number;
    validBitsPerSample: number;
}

interface WavDataSubchunk {
    chunkId: 'data';
    chunkSize: number;
    samples: Uint8Array;
}

const StepTable: number[] = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
];

const IndexTable: number[] = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8,
];

const MAX_INT16 = 32767;
const MIN_INT16 = -32768;
const COUNT_VALUES_UINT16 = 65536;

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const clampInt16 = (val: number) => clamp(val, MIN_INT16, MAX_INT16);
const signInt16 = (val: number) => val >= MAX_INT16 ? val - COUNT_VALUES_UINT16 : val;


export const decodeImaAdpcm = (ctx: AudioContext, buffer: ArrayBuffer): AudioBuffer => {
    const wav = new WaveFile(new Uint8Array(buffer));

    const fmt: WavFmtSubchunk = wav.fmt as any;
    const data: WavDataSubchunk = wav.data as any;

    if(fmt.audioFormat !== WAV_FORMAT_IMA){
        throw new TypeError('Given wav buffer is not of format IMA ADPCM');
    }

    // ima = 2sample/byte
    const targetAudioBuffer = ctx.createBuffer(1, data.samples.length * 2, fmt.sampleRate);
    const targetData = targetAudioBuffer.getChannelData(0);
    const imaBlocks = chunkArrayBufferView(data.samples, fmt.blockAlign);

    imaBlocks.forEach((block, i) => {
        const blockOffset = i * fmt.blockAlign * 2 - (i * 7);
        const decoded = decodeImaAdpcmBlock(block);
        decoded.forEach((byte, i) => targetData[blockOffset + i] = byte / MAX_INT16);
    });

    return targetAudioBuffer;
};

export const decodeImaAdpcmBlock = (inbuf: Uint8Array): Int16Array => {
    // TODO: investigate Magic number 7
    const outbuf = new Int16Array(inbuf.length * 2 - 7);
    let inbufOffset = 0;
    let outbufOffset = 0;

    let pcmData = signInt16(inbuf[0] | (inbuf[1] << 8));
    outbuf[outbufOffset++] = pcmData;

    let index = inbuf[2];
    if(index < 0 || index > 88 || inbuf[3]){
        throw new Error('Something is wrong with your wav');
    }
    inbufOffset += 4;

    let chunks = (inbuf.length - inbufOffset) / 4;

    while(chunks--){
        for (let i = 0; i < 4; i++) {
            let step = StepTable[index];
            let delta = step >> 3;

            let data = inbuf[inbufOffset];
            if(data & 1){
                delta += (step >> 2);
            }
            if(data & 2){
                delta += (step >> 1);
            }
            if(data & 4){
                delta += step;
            }
            if(data & 8){
                delta = -delta;
            }
            pcmData += delta;
            index += IndexTable[data & 0x7];
            index = clamp(index, 0, 88);
            pcmData = clampInt16(pcmData);
            outbuf[outbufOffset + (i * 2)] = pcmData;

            // Sample 2
            step = StepTable[index];
            delta = step >> 3;

            if(data & 0x10){
                delta += (step >> 2);
            }
            if(data & 0x20){
                delta += (step >> 1);
            }
            if(data & 0x40){
                delta += step;
            }
            if(data & 0x80){
                delta = -delta;
            }

            pcmData += delta;
            index += IndexTable[(data >> 4) & 0x7];
            index = clamp(index, 0, 88);
            pcmData = clampInt16(pcmData);
            outbuf[outbufOffset + (i * 2 + 1)] = pcmData;

            inbufOffset++;
        }

        outbufOffset += 8;
    }
    return outbuf;
};

const chunkArrayBufferView = (data: Uint8Array, chunkSize: number): Uint8Array[] => {
    const chunks: Uint8Array[] = [];

    const chunksLength = Math.ceil(data.length / chunkSize);
    for (let index = 0; index < chunksLength; index++) {
        chunks.push(data.slice(index * chunkSize, index * chunkSize + chunkSize));
    }

    return chunks;
}
