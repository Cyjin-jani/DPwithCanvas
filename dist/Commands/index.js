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
export class Command {
}
export class BackCommand extends Command {
    history;
    name = 'back';
    constructor(history) {
        super();
        this.history = history;
    }
    execute() {
        // 뒤로가기 구현
        // 여기서 바로 비즈니스 로직을 구현하지 않고, 아래와 같이 history의 함수를 호출해서 처리한다면?
        // 그것이 바로 receiver(수신자)의 역할임.
        // this.grimpan.history.goBack(); // 다만 이런식의 receiver가 필수는 아님
        this.history.undo(); // receiver에게 로직 전송
    }
}
export class ForwardCommand extends Command {
    history;
    name = 'forward';
    constructor(history) {
        super();
        this.history = history;
    }
    execute() {
        this.history.redo(); // receiver에게 로직 전송
    }
}
export class PenSelectCommand extends Command {
    grimpan;
    name = 'penSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // pen 로직 구현
        this.grimpan.menu.setActiveBtn('pen');
    }
}
export class EraserSelectCommand extends Command {
    grimpan;
    name = 'eraserSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // 지우개 로직 구현
        this.grimpan.menu.setActiveBtn('eraser');
    }
}
export class CircleSelectCommand extends Command {
    grimpan;
    name = 'circleSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // circle 로직 구현
        this.grimpan.menu.setActiveBtn('circle');
    }
}
export class RectangleSelectCommand extends Command {
    grimpan;
    name = 'rectangleSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // rectangle 로직 구현
        this.grimpan.menu.setActiveBtn('rectangle');
    }
}
export class PipetteSelectCommand extends Command {
    grimpan;
    name = 'pipetteSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // pipette 로직 구현
        this.grimpan.menu.setActiveBtn('pipette');
    }
}
export class SaveCommand extends Command {
    grimpan;
    name = 'save';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        this.grimpan.saveStrategy();
    }
}
export class SaveHistoryCommand extends Command {
    grimpan;
    name = 'saveHistory';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    execute() {
        // 그리기 끝난 후 현재 상태 저장
        this.grimpan.history.saveHistory();
    }
}
