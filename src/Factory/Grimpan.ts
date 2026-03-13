import { BackCommand, ForwardCommand } from '../Commands/index.js';
import { BlurFilter, DefaultFilter, GrayscaleFilter, InvertFilter } from '../filters/index.js';
import {
  CircleMode,
  EraserMode,
  PenMode,
  PipetteMode,
  RectangleMode,
  type Mode,
} from '../modes/index.js';
import { SubscriptionManager } from '../Observer.js';
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
  mode!: Mode;
  color: string;
  active: boolean; // 마우스 눌렀는지 유무.
  saveStrategy!: () => void;
  saveSetting = {
    blur: false,
    invert: false,
    grayscale: false,
  };

  protected constructor(canvas: HTMLCanvasElement | null, factory: AbstractGrimpanFactory) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.color = '#000';
    this.active = false;
    this.setSaveStrategy('png');
    SubscriptionManager.getInstance().addEvent('saveComplete');
  }

  setSaveStrategy(imageType: 'png' | 'jpg' | 'webp' | 'avif' | 'gif' | 'pdf') {
    // 각 case 별로 일종의 알고리즘이 필요. 알고리즘을 전략이라고 부를 수도 있음.
    // 그래서 각 전략 별로 만드는 것이 Strategy pattern.
    // 원래는 객체로 만들어서 관리하지만, 아래와 같이 간단한 경우엔 람다 함수로 처리할 수도 있음.

    // 자기 스스로 상태를 바꿀 수 있는 건 state 패턴.
    // 예를 들어 grimpan.setStrategy('something') 이런 식으로 상태를 스스로 setting
    // saveStrategy는 어떤 grimpan이라든지 의존성을 받아서 처리할 수가 없음.
    // 결론적으로 부모에 대한 참조를 가지고 있지 않아야 전략(Strategy) 패턴이라고 볼 수 있음.
    switch (imageType) {
      case 'png':
        this.saveStrategy = () => {
          // data 준비
          let imageData = this.ctx.getImageData(0, 0, 300, 300);
          const offscreenCanvas = new OffscreenCanvas(300, 300);
          const offscreenContext = offscreenCanvas.getContext('2d')!;
          offscreenContext.putImageData(imageData, 0, 0);
          // 책임 연쇄 패턴으로 filter를 적용.
          const df = new DefaultFilter();
          let filter = df;
          if (this.saveSetting.blur) {
            const bf = new BlurFilter();
            filter = filter.setNext(bf);
          }

          if (this.saveSetting.grayscale) {
            const gf = new GrayscaleFilter();
            filter = filter.setNext(gf);
          }

          if (this.saveSetting.invert) {
            const ivf = new InvertFilter();
            filter = filter.setNext(ivf);
          }
          // 필더 적용 완료 시 이미지 다운로드 처리.
          // 반드시 책임 연쇄 패턴에선 첫 번째 handle을 실행해야 함
          df.handle(offscreenCanvas).then(() => {
            const a = document.createElement('a');
            a.download = 'canvas.png';
            offscreenCanvas.convertToBlob().then((blob) => {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const dataURL = reader.result as string;
                let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
                a.href = url;
                a.click();
                // 저장 완료에 대한 알림을 전달하기 위해 옵저버 패턴을 사용.
                // 누가 구독하고 있는지는 모르겠지만, 구독하고 있는 모두에게 알림을 주겠다는 것.
                SubscriptionManager.getInstance().publish('saveComplete');
              });
              reader.readAsDataURL(blob);
            });
          });
        };
        break;
      case 'jpg':
        this.saveStrategy = () => {
          const a = document.createElement('a');
          a.download = 'canvas.jpg';
          a.href = this.canvas.toDataURL('image/jpeg');
          a.click();
        };
        break;
      case 'webp':
        this.saveStrategy = () => {
          const a = document.createElement('a');
          a.download = 'canvas.webp';
          a.href = this.canvas.toDataURL('image/webp');
          a.click();
        };
        break;
      case 'avif':
        this.saveStrategy = () => {};
        break;
      case 'gif':
        this.saveStrategy = () => {};
        break;
      case 'pdf':
        this.saveStrategy = () => {};
        break;
    }
  }

  setMode(mode: GrimpanMode) {
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

  setColor(color: string) {
    this.color = color;
  }

  changeColor(color: string) {
    this.setColor(color);
    if (this.menu.colorBtn) {
      this.menu.colorBtn.value = color;
    }
  }

  abstract initialize(option: GrimpanOption): void;
  abstract onMouseDown(e: MouseEvent): void;
  abstract onMouseMove(e: MouseEvent): void;
  abstract onMouseUp(e: MouseEvent): void;

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

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
  }

  override onMouseDown(e: MouseEvent): void {
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

  override onMouseMove(e: MouseEvent): void {
    this.mode.mousemove(e);
  }

  override onMouseUp(e: MouseEvent): void {
    this.mode.mouseup(e);
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

  override onMouseDown(): void {}

  override onMouseMove(): void {}

  override onMouseUp(): void {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
    }
    return this.instance;
  }
}

export { Grimpan, IEGrimpan, ChromeGrimpan };
