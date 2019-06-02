import 'allocator/tlsf';
export { memory };

declare function log(val: string): void;

const StepTable: u16[] = [
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

const IndexTable: i8[] = [
  -1, -1, -1, -1, 2, 4, 6, 8,
  -1, -1, -1, -1, 2, 4, 6, 8,
];

export function decode(inbuf: u8[], outbufA: f32[], outbufB: f32[], blockSize: u32, channelCount: i32): void {
  let blocksCount = Math.floor(inbuf.length / blockSize);
  let outbufOffset: u32 = 0;
  log('len: ' + <string>inbuf[0]);

  for(let i = 0; i < blocksCount; i++){
    let chunkOffset = i * blockSize;
    outbufOffset = decodeBlock(inbuf, outbufA, outbufB, chunkOffset, outbufOffset, channelCount);
  }
}

export function allocatef32Array(length: u32): Float32Array {
  return new Float32Array(length);
}

function decodeBlock(inbuf: u8[], outbufA: f32[], outbufB: f32[], inbufOffset: u32, outbufOffset: u32, channelCount: i32): u32 {
  let pcmData: i32[] = [0, 0];
  let index: i8[] = [0, 0];

  for(let ch = 0; ch < channelCount; ch++){
    pcmData[ch] = <i16>(inbuf[inbufOffset] | (inbuf[inbufOffset + 1] << 8));
    outbufA[outbufOffset] = i16Tof32(<i16>pcmData[ch]);
    index[ch] = inbuf[inbufOffset + 2];

    if(index[ch] < 0 || index[ch] > 88 || inbuf[inbufOffset + 3] === 0){
      throw new Error('Something is wrong with your wav');
    }
    inbufOffset += 4;
  }
  outbufOffset++;

  let chunks = (inbuf.length - inbufOffset) / (channelCount * 4);

  while(chunks--){
    for (let ch = 0; ch < channelCount; ch++) {
      for (let i = 0; i < 4; i++) {
        let step = StepTable[index[ch]];
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
        pcmData[ch] += delta;
        index[ch] += IndexTable[data & 0x7];
        index[ch] = clampi8(index[ch], 0, 88);
        pcmData[ch] = clampi32(pcmData[ch], i16.MIN_VALUE, i16.MAX_VALUE);
        outbufA[outbufOffset + (i * 2)] = i16Tof32(<i16>pcmData[ch]);

        // Sample 2
        step = StepTable[index[ch]];
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

        pcmData[ch] += delta;
        index[ch] += IndexTable[(data >> 4) & 0x7];
        index[ch] = clampi8(index[ch], 0, 88);
        pcmData[ch] = clampi32(pcmData[ch], i16.MIN_VALUE, i16.MAX_VALUE);
        outbufA[outbufOffset + (i * 2 + 1)] = i16Tof32(<i16>pcmData[ch]);

        inbufOffset++;
      }
    }

    outbufOffset += 8;
  }

  return outbufOffset;
}

function i16Tof32(val: i16): f32 {
  return val / <f32>i16.MAX_VALUE;
}

function clampi8(val: i8, min: i8, max: i8): i8 {
  return val > max ? max : val < min ? min : val;
}

function clampi32(val: i32, min: i32, max: i32): i32 {
  return val > max ? max : val < min ? min : val;
}
