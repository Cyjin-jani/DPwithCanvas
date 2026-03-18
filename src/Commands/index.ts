import type { Grimpan } from '../Factory/Grimpan.js';
import type { GrimpanHistory } from '../Factory/GrimpanHistory.js';

/**
 * 어댑터 패턴
 * 두 개의 인터페이스가 있는데, 그 둘이 서로 호환이 안되는 상황에서, 그 두 인터페이스를 호환되게 중간에서 처리하는 역할임
 * 아래 예시 참고
 */

// export class Invoker {
//   constructor(private readonly command: { run(): void }) {}

//   invoke() {
//     this.command.run();
//   }
// }

// Invoker와 Command가 통신해야 하는데, 서로 run - execute로 다른 상황. (호환이 안되는 상황)
// new Invoker(new BackCommand({} as any)); run이 없고 execute가 있어서 이렇게 쓸 수 없음.
// 이때 어댑터를 사용할 수 있음.

// export class Adapter {
//   constructor(private readonly command: Command) {}
//   run() {
//     this.command.execute();
//   }
// }
// new Invoker(new Adapter(new BackCommand({} as any))); // 이렇게 Adapter로 감싸주면 문제가 해결됨.
// invoker 그냥 수정하면 되지 않나? 할 수 있음. 맞음.
// 그래서, 이렇게 수정 가능하면 걍 invoker를 수정해서 쓰면 됨
// 문제는, 두 개의 인터페이스가 다 남의 코드라면? (npm 라이브러리들)
// 그 때에는 라이브러리 소스코드 수정이 어려우니 어댑터를 만들어서 사용해야 함.
// 즉, 기존 코드를 변경하지 못하는 (어려운) 경우에 타입을 맞춰주는 것이 어댑터라는 패턴.

export abstract class Command {
  abstract name: string;
  abstract execute(): void;
}

// 데코레이터 패턴 (기존 클래스에 기능 추가하기.)
// 아래와 같이 로거와 카운터가 필요함
export const counter: { [key: string]: number } = {}; // 각각의 명령이 몇번 실행되었나.

// abstract class CommandDecorator {
//   name: string;
//   constructor(protected readonly command: Command) {
//     this.name = this.command.name;
//   }
//   abstract execute(): void;
// }

// class ExecuteLogger extends CommandDecorator {
//   override execute() {
//     console.log(this.command.name + '명령을 실행합니다.');
//     this.command.execute();
//   }

//   showLogger() {}
// }

// class ExecuteCounter extends CommandDecorator {
//   override execute() {
//     this.command.execute();
//     counter[this.command.name] = (counter[this.command.name] ?? 0) + 1;
//   }

//   additional() {}
// }

// JS데코레이터 (믹스인 패턴)
// 아래 함수같은 형태가 믹스인 패턴임.
// 함수가 class를 받아서, 그 class를 상속한 자식 class를 return하는 패턴.
// 데코레이터 패턴처럼, 추가적인 메서드를 class 내에 넣어줄 수도 있음.
// 상속을 통해서 기존 기능 확장이나, 신규 메서드 추가 등이 가능함.
function countMixin(value: typeof BackCommand, context: ClassDecoratorContext) {
  // context의 타입은 class에 붙이냐, method에 붙이냐 등에 따라 달라짐.
  // value라는 건, decorator를 붙인 대상이 됨.
  // 아래의 경우, BackCommand가 value가 되는 것.

  // 익명 class를 return해줌.
  return class extends value {
    override execute() {
      super.execute(); // 원본
      counter[this.name] = (counter[this.name] ?? 0) + 1;
    }
    additional() {}
  };
}

function loggerMixin(value: typeof BackCommand, context: ClassDecoratorContext) {
  return class extends value {
    override execute() {
      console.log(this.name + '명령을 실행합니다.');
      super.execute(); // 원본
    }

    logging() {}
  };
}

@countMixin
@loggerMixin
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

// 이런 식으로 데코레이터 패턴을 사용할 수 있음. (로깅과 카운터 로직을 포함하는 커맨드)
// new ExecuteCounter(new ExecuteLogger(new BackCommand({} as any)));
// 데코레이터 순서를 주의해야 함. 여기서는 로거 먼저 그리고 카운터라서 위와 같이 표현.
// 모양이 기존 클래스와 같음. (name과 execute가 있는 형태.. 원본 클래스의 것들을 가지고 있음)
// 완벽하게 똑같은 경우는 프록시라고 이야기 함. 데코레이터의 경우에는 여러 추가적인 메서드나 기능 등을 추가할 수 있음. (additional, showLogger 같은.)
// 책임 연쇄 패턴과 다른 점은, 중간에 멈출 수 없음. 책임연쇄 패턴은 중간에 handle이라는 걸 통해 멈추거나 지속할 수 있는데, 데코레이터는 따로 멈추는 과정이 없다.

export class ForwardCommand extends Command {
  name = 'forward';

  constructor(private history: GrimpanHistory) {
    super();
  }

  override execute(): void {
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

// 프록시 패턴 (프록시: 대리인이라는 뜻)
// 어떤 액션 등에 대한 접근 제어를 구현할 때 주로 사용. 프록시 패턴을 쓰는 곳에서 데코레이터 패턴을 사용할수도 있음.
// 객체 자신이 스스로 액션을 하기 때문에, 클라이언트에서 신경을 써주지 않아도 됨.

interface ISelectCommand {
  grimpan: Grimpan;
  name: string;
  execute(): void;
}
export class PremiumCommandProxy {
  // 프록시는 원본이랑 모양이 똑같아야 함.
  name: string;
  // 다만, 다른점은 constructor에서 proxy를 할 커맨드 자체를 받음
  constructor(private readonly command: ISelectCommand) {
    this.name = command.name;
  }

  execute(): void {
    // 이런 식으로 지연 초기화를 해줄 수도 있음.
    // if (!this.command.loaded) {
    //     this.command.load()
    // }

    //! 구현을 위해서 잠시 해제해둠 ()
    if (!this.command.grimpan.isPremium) {
      this.command.execute();
    } else {
      alert('프리미엄 이용자만 이용 가능합니다.');
    }
  }
}
export class CircleSelectCommand extends Command implements ISelectCommand {
  name = 'circleSelect';

  constructor(public grimpan: Grimpan) {
    super();
  }

  load() {
    // 무거운 작업
  }

  override execute(): void {
    // circle 로직 구현
    this.grimpan.menu.setActiveBtn('circle');
  }
}
export class RectangleSelectCommand extends Command implements ISelectCommand {
  name = 'rectangleSelect';

  constructor(public grimpan: Grimpan) {
    super();
  }

  load() {
    // 무거운 작업
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

export class SaveHistoryCommand extends Command {
  name = 'saveHistory';

  constructor(private grimpan: Grimpan) {
    super();
  }

  override execute(): void {
    // 그리기 끝난 후 현재 상태 저장
    this.grimpan.history.saveHistory();
  }
}
