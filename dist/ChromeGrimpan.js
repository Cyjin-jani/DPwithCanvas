import AbstractGrimpan, {} from './Factory/AbstractGrimpan.js';
import { ChromeGrimpanFactory } from './Factory/GrimpanFactory.js';
class ChromeGrimpan extends AbstractGrimpan {
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
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ChromeGrimpan(document.querySelector('#canvas'), ChromeGrimpanFactory);
        }
        return this.instance;
    }
}
export default ChromeGrimpan;
