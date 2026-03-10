import type { Grimpan } from '../Factory/Grimpan.js';
import type { GrimpanHistory } from '../Factory/GrimpanHistory.js';

export abstract class Command {
  abstract execute(): void;
}

export class BackCommand extends Command {
  name = 'back';

  constructor(private history: GrimpanHistory) {
    super();
  }

  override execute(): void {
    // 뒤로가기 구현
    // 여기서 바로 비즈니스 로직을 구현하지 않고, 아래와 같이 history의 함수를 호출해서 처리한다면?
    // 그것이 바로 receiver(수신자)의 역할임.
    // this.grimpan.history.goBack(); // 다만 이런식의 receiver가 필수는 아님
    this.history.undo(); // receiver에게 로직 전송
  }
}

export class ForwardCommand extends Command {
  name = 'forward';

  constructor(private history: GrimpanHistory) {
    super();
  }

  override execute(): void {
    // 뒤로가기 구현
    // 여기서 바로 비즈니스 로직을 구현하지 않고, 아래와 같이 history의 함수를 호출해서 처리한다면?
    // 그것이 바로 receiver(수신자)의 역할임.
    // this.grimpan.history.goBack(); // 다만 이런식의 receiver가 필수는 아님
    this.history.redo(); // receiver에게 로직 전송
  }
}

export class PenSelectCommand extends Command {
  name = 'penSelect';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // pen 로직 구현
    this.grimpan.menu.setActiveBtn('pen');
  }
}

export class EraserSelectCommand extends Command {
  name = 'eraserSelect';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // 지우개 로직 구현
    this.grimpan.menu.setActiveBtn('eraser');
  }
}

export class CircleSelectCommand extends Command {
  name = 'circleSelect';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // circle 로직 구현
    this.grimpan.menu.setActiveBtn('circle');
  }
}
export class RectangleSelectCommand extends Command {
  name = 'rectangleSelect';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // rectangle 로직 구현
    this.grimpan.menu.setActiveBtn('rectangle');
  }
}

export class PipetteSelectCommand extends Command {
  name = 'pipetteSelect';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // pipette 로직 구현
    this.grimpan.menu.setActiveBtn('pipette');
  }
}

export class SaveCommand extends Command {
  name = 'save';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    this.grimpan.saveStrategy();
  }
}
