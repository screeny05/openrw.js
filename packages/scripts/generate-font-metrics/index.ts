import 'setimmediate';
import "regenerator-runtime/runtime";
import { getBrowserPlatformAdapter } from '@rws/game-browser/adapter';
import { PlatformAdapter } from '@rws/platform/adapter';

const $input = <HTMLInputElement>document.querySelector('.js--input');
const $output = <HTMLTextAreaElement>document.querySelector('.js--output');
const $canvas = <HTMLCanvasElement>document.querySelector('.js--canvas');
const ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;

$input.addEventListener('change', async () => {
    if(!$input.files){
        return;
    }

    $input.remove();

    const adapter = getBrowserPlatformAdapter($input.files, document.documentElement);

    await adapter.load();

    const metrics = getMetrics(adapter, 'font1', 16, 13);

    ctx.fillStyle = 'magenta';
    metrics.forEach(glyph => {
        ctx.fillRect(glyph.startX, glyph.y, 1, glyph.height);
        ctx.fillRect(glyph.endX, glyph.y, 1, glyph.height);
    });

    $output.textContent = JSON.stringify(metrics);
});

interface GlyphMetric {
    startX: number;
    endX: number;
    y: number;
    width: number;
    height: number;
    isEmpty: boolean;
}

const getMetrics = (adapter: PlatformAdapter, textureName: string, glyphCols: number, glyphRows: number): GlyphMetric[] => {
    const texture = adapter.rwsStructPool.texturePool.get(textureName);
    const imgData = new ImageData(new Uint8ClampedArray(texture.data), texture.width, texture.height);

    $canvas.width = texture.width;
    $canvas.height = texture.height;

    ctx.clearRect(0, 0, texture.width, texture.height);
    ctx.putImageData(imgData, 0, 0);

    const glyphWidth = texture.width / glyphCols;
    const glyphHeight = texture.height / glyphRows;

    const metrics: GlyphMetric[] = [];

    for(let x = 0; x < glyphCols; x++){
        for(let y = 0; y < glyphRows; y++){
            metrics.push(getGlyphMetric(x, y, glyphWidth, glyphHeight));
        }
    }

    return metrics;
};

const getGlyphMetric = (col: number, row: number, glyphWidth: number, glyphHeight: number): GlyphMetric => {
    const x = col * glyphWidth;
    const y = row * glyphHeight;

    const transparency = getAlphaRows(x, y, x + glyphWidth, glyphHeight);

    let glyphStart = Object.keys(transparency).find(i => !transparency[i]);
    let glyphEnd = Object.keys(transparency).reverse().find(i => !transparency[i]);

    if(typeof glyphStart === 'undefined' || typeof glyphEnd === 'undefined'){
        return { startX: x, endX: x + glyphWidth, y: y, width: glyphWidth, height: glyphHeight, isEmpty: true };
    }

    const startX = Number.parseInt(glyphStart);
    const endX = Number.parseInt(glyphEnd);
    return { startX, endX, y: y, width: endX - startX, height: glyphHeight, isEmpty: false };
}

const getAlphaRows = (x: number, y: number, xEnd: number, rowHeight: number): { [i: number]: boolean } => {
    const isTransparent: { [i: number]: boolean } = {};
    let currentX = x;

    while(currentX < xEnd){
        isTransparent[currentX] = getRowIsTransparent(currentX, y, rowHeight);
        currentX++;
    }

    return isTransparent;
}

const getRowIsTransparent = (x: number, y: number, rowHeight: number, alphaTest: number = 127): boolean => {
    const row = ctx.getImageData(x, y, 1, rowHeight);

    for(let i = 0; i < rowHeight; i++){
        const a = row.data[i * 4 + 3];
        if(a >= alphaTest){
            return false;
        }
    }

    return true;
}
