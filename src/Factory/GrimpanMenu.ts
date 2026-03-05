import { GrimpanMenuBtn } from '../Builder/GrimpanMenuBtn.js';
import type ChromeGrimpan from '../ChromeGrimpan.js';
import type IEGrimpan from '../IEGrimpan.js';
import type Grimpan from './AbstractGrimpan.js';

export abstract class GrimpanMenu {
  grimpan: Grimpan;
  dom: HTMLElement;
  protected constructor(grimpan: Grimpan, dom: HTMLElement) {
    this.grimpan = grimpan;
    this.dom = dom;
  }

  abstract initialize(types: BtnType[]): void;
  static getInstance(grimpan: Grimpan, dom: HTMLElement) {}
}

export class IEGrimpanMenu extends GrimpanMenu {
  private static instance: IEGrimpanMenu;
  override initialize(types: BtnType[]) {}

  static override getInstance(grimpan: IEGrimpan, dom: HTMLElement) {
    if (!this.instance) {
      this.instance = new IEGrimpanMenu(grimpan, dom);
    }
    return this.instance;
  }
}

type BtnType =
  | 'back'
  | 'forward'
  | 'color'
  | 'pipette'
  | 'pen'
  | 'circle'
  | 'rectangle'
  | 'eraser'
  | 'save';
export class ChromeGrimpanMenu extends GrimpanMenu {
  private static instance: ChromeGrimpanMenu;
  override initialize(types: BtnType[]): void {
    types.forEach(this.drawButtonByType.bind(this));
  }

  drawButtonByType(type: BtnType) {
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

  static override getInstance(grimpan: ChromeGrimpan, dom: HTMLElement) {
    if (!this.instance) {
      this.instance = new ChromeGrimpanMenu(grimpan, dom);
    }
    return this.instance;
  }
}
