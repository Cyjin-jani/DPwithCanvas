import { BackCommand, ForwardCommand } from '../Commands/index.js';
import { CircleMode, EraserMode, PenMode, PipetteMode, RectangleMode, } from '../modes/index.js';
import { ChromeGrimpanFactory, IEGrimpanFactory, } from './GrimpanFactory.js';
class Grimpan {
    canvas;
    ctx;
    history;
    menu;
    mode;
    color;
    active; // 마우스 눌렀는지 유무.
    constructor(canvas, factory) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.color = '#000';
        this.active = false;
    }
    setMode(mode) {
        console.log(mode);
        switch (mode) {
            case 'pen':
                this.mode = new PenMode(this);
                break;
            case 'eraser':
                this.mode = new EraserMode(this);
                break;
            case 'pipette':
                this.mode = new PipetteMode(this);
                break;
            case 'rectangle':
                this.mode = new RectangleMode(this);
                break;
            case 'circle':
                this.mode = new CircleMode(this);
                break;
        }
    }
    setColor(color) {
        this.color = color;
    }
    changeColor(color) {
        this.setColor(color);
        if (this.menu.colorBtn) {
            this.menu.colorBtn.value = color;
        }
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
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    }
    onMouseDown(e) {
        /**
         * State 패턴 활용의 예시
         * 두개 이상의 함수 내에서 동일한 if-else문 또는 switch-case 패턴이 반복되는 경우 사용할 수 있음.
         */
        this.mode.mousedown(e);
        // State 패턴이 없으면 여기서 switch case를 사용해야 함
        // switch (this.mode) {
        //   case 'pen':
        //     break;
        //   case 'eraser':
        //     break;
        //   case 'pipette':
        //     break;
        //   ...등등 내부 로직까지 포함. 이 switch case가 onMouseMove, onMouseUp에서도 동일하게 사용됨.
        // }
    }
    onMouseMove(e) {
        this.mode.mousemove(e);
    }
    onMouseUp(e) {
        this.mode.mouseup(e);
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
    onMouseDown() { }
    onMouseMove() { }
    onMouseUp() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
        }
        return this.instance;
    }
}
export { Grimpan, IEGrimpan, ChromeGrimpan };
