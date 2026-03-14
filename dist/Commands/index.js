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
