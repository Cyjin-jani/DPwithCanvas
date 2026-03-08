import { BackCommand, ForwardCommand } from '../Commands/index.js';
import {
  ChromeGrimpanFactory,
  IEGrimpanFactory,
  type AbstractGrimpanFactory,
} from './GrimpanFactory.js';
import type { ChromeGrimpanHistory, GrimpanHistory } from './GrimpanHistory.js';
import type { BtnType, ChromeGrimpanMenu, GrimpanMenu } from './GrimpanMenu.js';

export interface GrimpanOption {
  menu: BtnType[];
}

export type GrimpanMode = 'pen' | 'eraser' | 'pipette' | 'circle' | 'rectangle';

abstract class Grimpan {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  history!: GrimpanHistory;
  menu!: GrimpanMenu;
  mode!: GrimpanMode;

  protected constructor(canvas: HTMLCanvasElement | null, factory: AbstractGrimpanFactory) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  setMode(mode: GrimpanMode) {
    console.log(mode);
    this.mode = mode;
  }

  abstract initialize(option: GrimpanOption): void;

  static getInstance() {}
}

class ChromeGrimpan extends Grimpan {
  // 다른 곳에서 new ChromeGrimpan(document.querySelector('#canvas'))등 별도 인스턴스를 만들어 사용하지 못하도록 하기 위해 private으로 처리함
  private static instance: ChromeGrimpan;
  override menu: ChromeGrimpanMenu;
  override history: ChromeGrimpanHistory;

  private constructor(canvas: HTMLCanvasElement | null, factory: typeof ChromeGrimpanFactory) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
    super(canvas, factory);
    this.menu = factory.createGrimpanMenu(this, document.querySelector('#menu')!);
    this.history = factory.createGrimpanHistory(this);
  }

  initialize(option: GrimpanOption) {
    this.menu.initialize(option.menu);
    this.history.initialize();
    window.addEventListener('keydown', (e: KeyboardEvent) => {
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

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector('#canvas'), ChromeGrimpanFactory);
    }
    return this.instance;
  }
}

class IEGrimpan extends Grimpan {
  private static instance: IEGrimpan;

  initialize() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
    }
    return this.instance;
  }
}

export { Grimpan, IEGrimpan, ChromeGrimpan };
