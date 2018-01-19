import * as blessed from 'blessed';
import * as blessedContrib from 'blessed-contrib';

import { inspect, format } from 'util';
import * as death from 'death';
import bind from 'bind-decorator';

import Game from '../rwsgame/game';
import ImgIndex from '../rwsgame/img-index';

export default class CLI {
    game: Game;

    screen: blessed.Widgets.Screen;
    grid: any;
    imgTree: any;
    infoBox: blessed.Widgets.BoxElement;
    logBox: blessed.Widgets.ListElement;
    fpsGraph: any;
    fpsSeries: any;
    logBuffer: string[] = [];
    imgData: any;

    constructor(game: Game){
        this.game = game;
        this.screen = blessed.screen({ smartCSR: true });
        this.grid = new blessedContrib.grid({ rows: 12, cols: 12, screen: this.screen });


        this.addImgTree();
        this.addInfoBox();
        this.addLogBox();
        this.addFpsGraph();

        this.game.on('fps', this.onFps);
        this.game.on('init', this.onInit);
        death({ uncaughtException: true })(this.onDestroy);

        this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

        this.screen.render();
    }

    addImgTree(){
        const tree = this.grid.set(0, 0, 7, 4, blessedContrib.tree, {
            label: 'IMG'
        });
        tree.focus();

        const rootData = {
            extended: true,
            children: {}
        }
        this.imgData = rootData;
        this.imgTree = tree;

        tree.on('select', async node => {
            if(!node.entry){
                return;
            }

            const index: ImgIndex = node.parent.img;

            this.setInfo(await index.parseEntry(node.entry));
        });
    }

    addInfoBox(){
        this.infoBox = this.grid.set(0, 4, 7, 8, blessed.box, {
            scrollable: true,
            label: 'Info'
        });
    }

    setInfo(info){
        this.infoBox.setContent(inspect(info, {
            depth: Infinity,
            colors: true
        }));
        this.screen.render();
    }

    addLogBox(){
        this.logBox = this.grid.set(7, 0, 3, 12, blessed.list, {
            scrollable: true,
            label: 'Log'
        });
        global.console.log = this.log;
        global.console.warn = this.log;
        global.console.error = this.log;
    }

    addFpsGraph(){
        this.fpsGraph = this.grid.set(10, 0, 2, 12, blessedContrib.line, {
            style: {
                line: 'green'
            },
            label: '0 FPS',
            xLabelPadding: 0,
            xPadding: 0,
            showLegend: false
        });

        this.fpsSeries = {
            x: [0],
            y: [0]
        };

        this.fpsGraph.setData([this.fpsSeries]);
    }

    log(...args){
        this.logBuffer.push(format.apply(null, args));
        this.logBox.setItems(<any>this.logBuffer);
        this.logBox.scrollTo(this.logBuffer.length);
        this.screen.render();
    }

    onFps(count, measureCount){
        this.fpsGraph.setLabel(`${count} FPS`);
        this.fpsSeries.y.push(count);
        this.fpsSeries.x.push(`${measureCount}s`);

        if(this.fpsSeries.x.length > this.screen.cols / 4){
            this.fpsSeries.x.shift();
            this.fpsSeries.y.shift();
        }

        this.fpsGraph.setData([this.fpsSeries]);
        this.screen.render();
    }

    onInit(){
        this.game.data.imgIndices.forEach((img, name) => {
            const imgData = { img, children: {} };

            img.imgIndex.forEach((entry, name) => {
                imgData.children[name] = { entry };
            })

            this.imgData.children[name] = imgData;
        });

        this.imgTree.setData(this.imgData);
    }

    @bind
    onDestroy(){
        this.screen.destroy();
    }
}
