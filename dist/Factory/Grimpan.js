import { BackCommand, ForwardCommand } from '../Commands/index.js';
import { ChromeGrimpanFactory, IEGrimpanFactory, } from './GrimpanFactory.js';
class Grimpan {
    canvas;
    ctx;
    history;
    menu;
    mode;
    constructor(canvas, factory) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }
    setMode(mode) {
        console.log(mode);
        this.mode = mode;
    }
    static getInstance() { }
}
class ChromeGrimpan extends Grimpan {
    // 다른 곳에서 new ChromeGrimpan(document.querySelector('#canvas'))등 별도 인스턴스를 만들어 사용하지 못하도록 하기 위해 private으로 처리함
    static instance;
    menu;
    history;
    constructor(canvas, factory) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
        super(canvas, factory);
        this.menu = factory.createGrimpanMenu(this, document.querySelector('#menu'));
        this.history = factory.createGrimpanHistory(this);
    }
    initialize(option) {
        this.menu.initialize(option.menu);
        this.history.initialize();
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
                this.menu.executeCommand(new ForwardCommand(this.history));
                return;
            }
            if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
                this.menu.executeCommand(new BackCommand(this.history));
                return;
            }
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ChromeGrimpan(document.querySelector('#canvas'), ChromeGrimpanFactory);
        }
        return this.instance;
    }
}
class IEGrimpan extends Grimpan {
    static instance;
    initialize() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
        }
        return this.instance;
    }
}
export { Grimpan, IEGrimpan, ChromeGrimpan };
