import { SubscriptionManager } from '../Observer.js';
import { Grimpan, IEGrimpan, ChromeGrimpan } from './Grimpan.js';
// 원래는 일반 배열인데, 프로토타입 패턴으로 구현하기 위해 Array를 상속받아 클래스로 만듦.
class HistoryStack extends Array {
    // 프로토타입 패턴의 핵심.
    // 기존 객체를 잘 복사하고, 기존 배열과의 연결관계도 잘 끊고.
    clone() {
        return this.slice();
        // 위 경우는 운이 좋은 케이스. class별로 clone 메서드의 구현 난이도는 천차만별임.
    }
    // saveHistory의 로직 수정을 위해 필요한 slice
    slice(start, end) {
        return super.slice(start, end);
    }
}
/**
 * 프로토타입의 목적
 *  다음과 같이 두 객체가 있다고 하면, 다음과 같이 처리하기 위함
 * const a = new A(1, 2, 3, 4, 5, 6, 7, 8, 9)
 * const a2 = new A(1, 2, 3, 40, 5, 6, 7, 80, 9) // 이렇게 하지 말고, 아래와 같이 처리.
 * const a3 = a.clone();
 * a3.four = 40;
 * a3.eight = 80;
 * 이런 식으로 하기 위해 프로토타입 패턴을 사용하는 것. (거의 속성이 비슷한데, 일부 속성만 다른 경우에 활용하기 좋음)
 * 물론, {1, 2, 3, 4, 5, 6, 7, 8} 이런식으로 변수로 빼서 캐싱할 수도 있지 않냐 싶음.
 * - 하지만, 그렇게 되면 결국 new A()와 멀리 떨어진 곳에 위치하게 되는 것임. 외부에 있게 됨.
 * - 그래서 프로토타입은 그렇게 외부에 캐싱하여 관리하는 게 아니라, 내부적으로 clone을 사용하여 관리하자는 것.
 * - 단점이자 주의할 점: clone을 제대로 구현할 수 있어야만 한다.
 * - 상속 관계가 복잡하다던가, 깊은 복사를 제대로 못 하는 경우에 문제가 됨.
 * - clone을 수정했는데 원본이 같이 수정된다던가 하는 잘못 구현되는 경우도 많음.
 * - 부모 클래스에서 private 속성들이 많으면, 그리고 그 값을 복사해야 하면 사용하기 어렵다. (protected가 아니면 자식이 private에 접근할 수 없으니까)
 */
export class GrimpanHistory {
    grimpan;
    stack;
    index = -1;
    constructor(grimpan) {
        this.grimpan = grimpan;
        this.stack = new HistoryStack();
        // 구독 처리 (grimpan을 몰라도 됨)
        SubscriptionManager.getInstance().subscribe('saveComplete', {
            name: 'history',
            publish: this.afterSaveComplete.bind(this),
        });
    }
    // caretaker(케어 테이커)
    saveHistory() {
        const snapshot = this.grimpan.makeSnapshot();
        if (this.index === this.stack.length - 1) {
            this.stack.push(snapshot);
            this.index++;
        }
        else {
            // 뒤로가기를 몇 번 한 상황
            this.stack = this.stack.slice(0, this.index + 1);
            this.stack.push(snapshot);
            this.index++;
        }
        document.querySelector('#back-btn').disabled = false;
        document.querySelector('#forward-btn').disabled = true;
    }
    afterSaveComplete() {
        console.log('history: save completed');
    }
    // 구독 해지 (알림을 받고 싶지 않을 때) 처리 예시
    cancelSaveCompleteAlarm() {
        SubscriptionManager.getInstance().unsubscribe('saveComplete', 'history');
    }
    undoable() {
        return this.index > 0;
    }
    redoable() {
        return this.index < this.stack.length - 1;
    }
    undo() {
        if (this.undoable()) {
            this.index--;
            document.querySelector('#forward-btn').disabled = false;
        }
        else
            return;
        if (!this.undoable()) {
            document.querySelector('#back-btn').disabled = true;
        }
        this.grimpan.restore(this.stack[this.index]);
    }
    redo() {
        if (this.redoable()) {
            this.index++;
            document.querySelector('#back-btn').disabled = false;
        }
        else
            return;
        if (!this.redoable()) {
            document.querySelector('#forward-btn').disabled = true;
        }
        this.grimpan.restore(this.stack[this.index]);
    }
    getStack() {
        return this.stack.clone(); // 가져올 때에도 clone을 활용.
    }
    setStack(stack) {
        this.stack = stack.clone();
    }
    initialize() {
        // 버튼의 표시 처리
        document.querySelector('#back-btn').disabled = true;
        document.querySelector('#forward-btn').disabled = true;
    }
    static getInstance(grimpan) { }
}
export class IEGrimpanHistory extends GrimpanHistory {
    static instance;
    static getInstance(grimpan) {
        if (!this.instance) {
            this.instance = new IEGrimpanHistory(grimpan);
        }
        return this.instance;
    }
}
export class ChromeGrimpanHistory extends GrimpanHistory {
    static instance;
    static getInstance(grimpan) {
        if (!this.instance) {
            this.instance = new ChromeGrimpanHistory(grimpan);
        }
        return this.instance;
    }
}
