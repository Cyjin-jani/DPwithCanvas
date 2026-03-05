import { GrimpanMenuBtn } from '../Builder/GrimpanMenuBtn.js';
export class GrimpanMenu {
    grimpan;
    dom;
    constructor(grimpan, dom) {
        this.grimpan = grimpan;
        this.dom = dom;
    }
    static getInstance(grimpan, dom) { }
}
export class IEGrimpanMenu extends GrimpanMenu {
    static instance;
    initialize(types) { }
    static getInstance(grimpan, dom) {
        if (!this.instance) {
            this.instance = new IEGrimpanMenu(grimpan, dom);
        }
        return this.instance;
    }
}
export class ChromeGrimpanMenu extends GrimpanMenu {
    static instance;
    initialize(types) {
        types.forEach(this.drawButtonByType.bind(this));
    }
    drawButtonByType(type) {
        switch (type) {
            case 'back': {
                const btn = new GrimpanMenuBtn.Builder(this, '뒤로', 'button').build();
                btn.draw();
                return btn;
            }
            case 'forward': {
                const btn = new GrimpanMenuBtn.Builder(this, '앞으로', 'button').build();
                btn.draw();
                return btn;
            }
            case 'color': {
                const btn = new GrimpanMenuBtn.Builder(this, '색상', 'input').build();
                btn.draw();
                return btn;
            }
            case 'pipette': {
                const btn = new GrimpanMenuBtn.Builder(this, '스포이트', 'button').build();
                btn.draw();
                return btn;
            }
            case 'pen': {
                const btn = new GrimpanMenuBtn.Builder(this, '펜', 'button').build();
                btn.draw();
                return btn;
            }
            case 'circle': {
                const btn = new GrimpanMenuBtn.Builder(this, '원', 'button').build();
                btn.draw();
                return btn;
            }
            case 'rectangle': {
                const btn = new GrimpanMenuBtn.Builder(this, '사각형', 'button').build();
                btn.draw();
                return btn;
            }
            case 'eraser': {
                const btn = new GrimpanMenuBtn.Builder(this, '지우개', 'button').build();
                btn.draw();
                return btn;
            }
            case 'save': {
                const btn = new GrimpanMenuBtn.Builder(this, '저장', 'button').build();
                btn.draw();
                return btn;
            }
        }
    }
    static getInstance(grimpan, dom) {
        if (!this.instance) {
            this.instance = new ChromeGrimpanMenu(grimpan, dom);
        }
        return this.instance;
    }
}
