var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
// 데코레이터 패턴 (기존 클래스에 기능 추가하기.)
// 아래와 같이 로거와 카운터가 필요함
export const counter = {}; // 각각의 명령이 몇번 실행되었나.
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
function countMixin(value, context) {
    // context의 타입은 class에 붙이냐, method에 붙이냐 등에 따라 달라짐.
    // value라는 건, decorator를 붙인 대상이 됨.
    // 아래의 경우, BackCommand가 value가 되는 것.
    // 익명 class를 return해줌.
    return class extends value {
        execute() {
            super.execute(); // 원본
            counter[this.name] = (counter[this.name] ?? 0) + 1;
        }
        additional() { }
    };
}
function loggerMixin(value, context) {
    return class extends value {
        execute() {
            console.log(this.name + '명령을 실행합니다.');
            super.execute(); // 원본
        }
        logging() { }
    };
}
let BackCommand = (() => {
    let _classDecorators = [countMixin, loggerMixin];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Command;
    var BackCommand = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BackCommand = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
    };
    return BackCommand = _classThis;
})();
export { BackCommand };
// 이런 식으로 데코레이터 패턴을 사용할 수 있음. (로깅과 카운터 로직을 포함하는 커맨드)
// new ExecuteCounter(new ExecuteLogger(new BackCommand({} as any)));
// 데코레이터 순서를 주의해야 함. 여기서는 로거 먼저 그리고 카운터라서 위와 같이 표현.
// 모양이 기존 클래스와 같음. (name과 execute가 있는 형태.. 원본 클래스의 것들을 가지고 있음)
// 완벽하게 똑같은 경우는 프록시라고 이야기 함. 데코레이터의 경우에는 여러 추가적인 메서드나 기능 등을 추가할 수 있음. (additional, showLogger 같은.)
// 책임 연쇄 패턴과 다른 점은, 중간에 멈출 수 없음. 책임연쇄 패턴은 중간에 handle이라는 걸 통해 멈추거나 지속할 수 있는데, 데코레이터는 따로 멈추는 과정이 없다.
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
export class PremiumCommandProxy {
    command;
    // 프록시는 원본이랑 모양이 똑같아야 함.
    name;
    // 다만, 다른점은 constructor에서 proxy를 할 커맨드 자체를 받음
    constructor(command) {
        this.command = command;
        this.name = command.name;
    }
    execute() {
        // 이런 식으로 지연 초기화를 해줄 수도 있음.
        // if (!this.command.loaded) {
        //     this.command.load()
        // }
        if (this.command.grimpan.isPremium) {
            this.command.execute();
        }
        else {
            alert('프리미엄 이용자만 이용 가능합니다.');
        }
    }
}
export class CircleSelectCommand extends Command {
    grimpan;
    name = 'circleSelect';
    constructor(grimpan) {
        super();
        this.grimpan = grimpan;
    }
    load() {
        // 무거운 작업
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
    load() {
        // 무거운 작업
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
