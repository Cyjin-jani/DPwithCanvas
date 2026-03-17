import {
  CircleSelectCommand,
  Command,
  EraserSelectCommand,
  PenSelectCommand,
  PipetteSelectCommand,
  PremiumCommandProxy,
  RectangleSelectCommand,
  SaveHistoryCommand,
} from '../Commands/index.js';
import { Grimpan } from '../Factory/Grimpan.js';

const convertToHex = (color: number) => {
  if (color < 0) return 0;
  if (color > 255) return 255;

  const hex = color.toString(16); // 16진법으로 바꿈
  return `0${hex}`.slice(-2); // 2자리임을 고정 // 05 -> 05, 0ab -> ab
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${convertToHex(r)}${convertToHex(g)}${convertToHex(b)}`;
};

/**
 * State 패턴을 활용한 예시
 */
export abstract class Mode {
  constructor(protected grimpan: Grimpan) {}
  abstract mousedown(e: MouseEvent): void;
  abstract mousemove(e: MouseEvent): void;
  abstract mouseup(e: MouseEvent): void;

  // 모든 커맨드의 실행을 이 invoker 함수에서 통제하기 위해 따로 둠.
  invoke(command: Command) {
    command.execute();
  }
}

export class PenMode extends Mode {
  constructor(grimpan: Grimpan) {
    super(grimpan);
    grimpan.menu.executeCommand(new PenSelectCommand(grimpan));
  }

  override mousedown(e: MouseEvent): void {
    this.grimpan.active = true;
    this.grimpan.ctx.lineWidth = 1;
    this.grimpan.ctx.lineCap = 'round';
    this.grimpan.ctx.strokeStyle = this.grimpan.color;
    this.grimpan.ctx.globalCompositeOperation = 'source-over';
    this.grimpan.ctx.beginPath();
    this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
  }
  override mousemove(e: MouseEvent): void {
    if (!this.grimpan.active) return;
    this.grimpan.ctx.lineTo(e.offsetX, e.offsetY);
    this.grimpan.ctx.stroke();
    this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
  }
  override mouseup(e: MouseEvent): void {
    if (this.grimpan.active) {
      // history 저장
      this.invoke(new SaveHistoryCommand(this.grimpan));
    }
    this.grimpan.active = false;
  }
}
export class EraserMode extends Mode {
  constructor(grimpan: Grimpan) {
    super(grimpan);
    grimpan.menu.executeCommand(new EraserSelectCommand(grimpan));
  }

  override mousedown(e: MouseEvent): void {
    this.grimpan.active = true;
    this.grimpan.ctx.lineWidth = 10;
    this.grimpan.ctx.lineCap = 'round';
    this.grimpan.ctx.strokeStyle = this.grimpan.color;
    this.grimpan.ctx.globalCompositeOperation = 'destination-out';
    this.grimpan.ctx.beginPath();
    this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
  }
  override mousemove(e: MouseEvent): void {
    if (!this.grimpan.active) return;
    this.grimpan.ctx.lineTo(e.offsetX, e.offsetY);
    this.grimpan.ctx.stroke();
    this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
  }
  override mouseup(e: MouseEvent): void {
    if (this.grimpan.active) {
      // history 저장
      this.invoke(new SaveHistoryCommand(this.grimpan));
    }
    this.grimpan.active = false;
  }
}
export class PipetteMode extends Mode {
  constructor(grimpan: Grimpan) {
    super(grimpan);
    grimpan.menu.executeCommand(new PipetteSelectCommand(grimpan));
  }

  override mousedown(e: MouseEvent): void {}
  override mousemove(e: MouseEvent): void {
    const { data } = this.grimpan.ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    if (data[3] === 0) {
      // 투명도
      this.grimpan.changeColor('#ffffff');
    } else {
      this.grimpan.changeColor(rgbToHex(data[0] as number, data[1] as number, data[2] as number));
    }
  }
  override mouseup(e: MouseEvent): void {
    this.grimpan.setMode('pen');
  }
}
export class RectangleMode extends Mode {
  constructor(grimpan: Grimpan) {
    super(grimpan);
    grimpan.menu.executeCommand(new PremiumCommandProxy(new RectangleSelectCommand(grimpan)));
  }

  override mousedown(e: MouseEvent): void {
    this.grimpan.active = true;
  }
  override mousemove(e: MouseEvent): void {}
  override mouseup(e: MouseEvent): void {
    if (this.grimpan.active) {
      // history 저장
      this.invoke(new SaveHistoryCommand(this.grimpan));
    }
    this.grimpan.active = false;
  }
}
export class CircleMode extends Mode {
  constructor(grimpan: Grimpan) {
    super(grimpan);
    // 기존 코드를 수정하지 않고, proxy 패턴을 이용하여 프리미엄 유저만 사용하도록 접근제어를 할 수가 있음.
    grimpan.menu.executeCommand(new PremiumCommandProxy(new CircleSelectCommand(grimpan)));
  }

  override mousedown(e: MouseEvent): void {
    this.grimpan.active = true;
  }
  override mousemove(e: MouseEvent): void {}
  override mouseup(e: MouseEvent): void {
    if (this.grimpan.active) {
      // history 저장
      this.invoke(new SaveHistoryCommand(this.grimpan));
    }
    this.grimpan.active = false;
  }
}
