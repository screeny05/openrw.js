import { IHudElement, IHudElementConstructor } from "./hud-element";
import { IHud } from "./hud";
import { ITexture } from "./texture";
import { PlatformAdapter } from "@rws/platform/adapter";
import { IVec2Constructor } from "@rws/platform/graphic/vec2";
import { IGroup, IGroupConstructor } from "@rws/platform/graphic/group";
import * as GlyphMetricsFont2 from '@rws/resources/font-metrics/gta3-font2.json';

export interface GlyphMetric {
    startX: number;
    endX: number;
    y: number;
    width: number;
    height: number;
    isEmpty: boolean;
}

// 1/2em
const SPACE_WIDTH_FONT2 = GlyphMetricsFont2[0x2D].width / 2;

// this number was determined by looking at the texture's g and À
const MAGIC_OFFSET_Y_FONT2 = 5;

const LookupTable1 = [
    /*       00   01   02   03   04   05   06   07   08   09   0A   0B   0C   0D   0E   0F */
    /* 00 */ ' ', '!', '△', '#', '$', '%', '&', `'`, '(', ')', '*', '+', ',', '-', '.', '/',
    /* 10 */ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
    /* 20 */ '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    /* 30 */ 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    /* 40 */ '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 50 */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '°', '}', '~', ' ',
    /* 60 */ 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó',
    /* 70 */ 'Ô', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'ß', 'à', 'á', 'â', 'ä', 'æ', 'ç', 'è', 'é', 'ê',
    /* 80 */ 'ë', 'ì', 'í', 'î', 'ï', 'ò', 'ó', 'ô', 'ö', 'ù', 'ú', 'û', 'ü', 'Ñ', 'ñ', '¿',
    /* 90 */ '¡', `'`
];

const LookupTable2 = [
    /*       00   01   02   03   04   05   06   07   08   09   0A   0B   0C   0D   0E   0F */
    /* 00 */ ' ', '!', '△', '#', '$', '%', '&', `'`, '(', ')', '*', '+', ',', '-', '.', '/',
    /* 10 */ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '◀', '=', '▶', '?',
    /* 20 */ '™', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    /* 30 */ 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '°',
    /* 40 */ '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 50 */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '◯', ' ', ' ', ' ',
    /* 60 */ 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó',
    /* 70 */ 'Ô', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'ß', 'à', 'á', 'â', 'ä', 'æ', 'ç', 'è', 'é', 'ê',
    /* 80 */ 'ë', 'ì', 'í', 'î', 'ï', 'ò', 'ó', 'ô', 'ö', 'ù', 'ú', 'û', 'ü', 'Ñ', 'ñ', '¿',
    /* 90 */ '¡', `'`
];

const TransliterationTable = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ä': 'A', 'Æ': 'A',
    'Ç': 'C', 'ç': 'c',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'ß': 's',
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'æ': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'Ñ': 'N', 'ñ': 'n',
    '¿': '?', '¡': '!'
}

const OffsetYTable2 = {
    A: 3, B: 3, C: 2, D: 3, E: 3, F: 3, G: 3, H: 2, I: 2, J: 2, K: 2, L: 2,
    M: 2, N: 3, O: 2, P: 2, Q: 1, R: 1.5, S: 3, T: 2, U: 2.5, V: 2, W: 2,
    X: 2, Y: 2, Z: 2, g: -2, q: -2, r: -1, t: -1, u: -2, v: -1, w: -1, x: -2, y: -1
}

const transliterate = (char: string): string => {
    const transliterated = TransliterationTable[char];
    if(transliterated){
        return transliterated;
    }
    return char;
}

const ATLAS_COLS = 16;
const ATLAS_ROWS = 13;

export class HudText {
    hud: IHud;
    text: string;
    group: IGroup;
    texture: ITexture;
    platform: PlatformAdapter;
    LookupTable: string[];
    scaleFactor: number;

    HudElement: IHudElementConstructor;
    Group: IGroupConstructor;
    Vec2: IVec2Constructor;

    constructor(platform: PlatformAdapter, hud: IHud, text: string, fontHeight: number){
        Object.assign(this, platform.graphicConstructors);
        this.platform = platform;
        this.texture = this.platform.rwsStructPool.texturePool.get('font2');
        this.LookupTable = LookupTable2;
        this.group = new this.Group();
        this.hud = hud;
        this.hud.add(this.group);
        this.text = text;
        this.scaleFactor = fontHeight / (this.texture.height / ATLAS_ROWS);
        this.group.scale.set(this.scaleFactor, this.scaleFactor, 1);
        this.typeset();
    }

    typeset(): void {
        this.group.removeAllChildren();
        this.text.split('\n').forEach((line, y) => {
            this.typesetLine(line, y);
        });
    }

    typesetLine(line: string, y: number): void {
        let nextX = 0;
        line.split('').forEach((char, x) => {
            nextX = this.typesetChar(char, nextX, y);
        });
    }

    typesetChar(char: string, x: number, y: number): number {
        const el = this.createLetter(char);
        el.setPosition(x, y * -el.height);
        el.name = `char__${char}`;
        this.group.addChild(el);
        return x + el.width;
    }

    createLetter(char: string): IHudElement {
        const [charCol, charRow, i] = this.getCharAtlasPosition(char);
        const metrics = this.getGlyphMetrics(i, char);
        const el = new this.HudElement(this.texture);

        el.setSize(metrics.width, metrics.height);
        el.setTextureSize(metrics.width / this.texture.width, 1 / ATLAS_ROWS);
        el.setTextureOffset(metrics.startX, metrics.y);
        return el;
    }

    getCharAtlasPosition(char: string): [number, number, number] {
        let charIndex = this.LookupTable.indexOf(char);
        if(charIndex === -1){
            charIndex = 0x1F; // = ?
        }

        return [
            charIndex % ATLAS_COLS,
            Math.floor(charIndex / ATLAS_COLS),
            charIndex
        ];
    }

    getGlyphMetrics(index: number, char: string): GlyphMetric {
        const metrics: GlyphMetric = { ...GlyphMetricsFont2[index] };
        const offsetY = OffsetYTable2[char];

        if(!metrics){
            throw new Error('Cannot find glyph metrics for #' + index);
        }

        if(metrics.isEmpty){
            metrics.width = SPACE_WIDTH_FONT2;
        }

        if(offsetY){
            metrics.y -= offsetY;
        }

        metrics.y += MAGIC_OFFSET_Y_FONT2;

        return metrics;
    }
}
