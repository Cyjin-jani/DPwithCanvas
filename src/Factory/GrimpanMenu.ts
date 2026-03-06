import { GrimPanMenuInput, GrimPanMenuBtn } from '../Builder/GrimpanMenuBtn.js';
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

abstract class Command {
  abstract execute(): void;
}

class BackCommand extends Command {
  name = 'back';
  override execute(): void {
    // 뒤로가기 구현
    // 여기서 바로 비즈니스 로직을 구현하지 않고, 아래와 같이 history의 함수를 호출해서 처리한다면?
    // 그것이 바로 receiver(수신자)의 역할임.
    // this.grimpan.history.goBack(); // 다만 이런식의 receiver가 필수는 아님
  }
}
class PenCommand extends Command {
  name = 'pen';
  override execute(): void {
    // pen 로직 구현
  }
}

class EraserCommand extends Command {
  name = 'eraser';
  override execute(): void {
    // 지우개 로직 구현
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
    document.addEventListener('keyup', this.onClickBack);
  }

  // invoker 역할의 함수
  // invoker는 조건에 따라서 command를 호출할 수도 있고, 안할수도 있음.
  // 실행에 대한 조건을 여기서 다룰 수 있음.
  executeCommand(command: Command) {
    // 예시임
    // 비활성화 로직이 필요하다면
    // if (비활성화) return; 이런식으로 한번에 처리할 수 있음.
    // 그래서 중앙에서 command를 통제하는 이 함수가 필요.
    command.execute();
  }

  onClickBack() {
    // new BackCommand().execute(); // 이렇게 안하고 아래와 같이 처리하는 이유?
    // 만약 여러 command가 존재하는데, 모든 버튼 비활성화 같은 기능을 만들어야 한다면?
    // 위와 같이 command.execute()를 여기에 적으면, 모든 onClickXXX (pen, rectangle, circle 등)에 대해
    // 똑같은 코드로 조건 분기처리를 작성해서 execute 여부를 관리해야 함.
    // 다만 위와 같이 invoker 함수로 두면? executeCommand 함수 안에서 한번에 처리할 수 있음.
    this.executeCommand(new BackCommand());
  }

  drawButtonByType(type: BtnType) {
    switch (type) {
      case 'back': {
        const btn = new GrimPanMenuBtn.Builder(this, '뒤로').build();
        btn.draw();
        return btn;
      }
      case 'forward': {
        const btn = new GrimPanMenuBtn.Builder(this, '앞으로').build();
        btn.draw();
        return btn;
      }

      case 'color': {
        const btn = new GrimPanMenuInput.Builder(this, '컬러').build();
        btn.draw();
        return btn;
      }

      case 'pipette': {
        const btn = new GrimPanMenuBtn.Builder(this, '스포이트').build();
        btn.draw();
        return btn;
      }

      case 'pen': {
        const btn = new GrimPanMenuBtn.Builder(this, '펜').build();
        btn.draw();
        return btn;
      }

      case 'circle': {
        const btn = new GrimPanMenuBtn.Builder(this, '원').build();
        btn.draw();
        return btn;
      }

      case 'rectangle': {
        const btn = new GrimPanMenuBtn.Builder(this, '사각형').build();
        btn.draw();
        return btn;
      }

      case 'eraser': {
        const btn = new GrimPanMenuBtn.Builder(this, '지우개').build();
        btn.draw();
        return btn;
      }

      case 'save': {
        const btn = new GrimPanMenuBtn.Builder(this, '저장').build();
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
