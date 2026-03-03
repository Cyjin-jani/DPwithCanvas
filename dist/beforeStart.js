// 추상 클래스, 인터페이스, 구조적 타이핑
// 변수에 할당한 객체의 경우
const obj = {
    name: 'object',
    // age: 1, // 인터페이스에 적혀져 있지 않은 프로퍼티는 에러
};
// 함수의 경우 1 - 직접 객체를 전달하는 경우, 타입 검사로 인해 age 프로퍼티는 에러
function main(obj) { }
main({
    name: 'object',
    // age: 1 // 인터페이스에 적혀져 있지 않은 프로퍼티는 에러
});
const obj2 = {
    name: 'object',
    age: 1,
};
main(obj2);
const obj3 = {
    name: 'object',
    getName() {
        return this.name;
    },
};
// 추상 클래스
// interface의 역할도 하면서 private 같은걸 만들고 싶다면..? 그럴 때 추상 클래스를 사용
class Obj4 {
    name;
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
// 손쉽게 작성하려면 다음과 같이도 작성할 수 있다.
// ts에서 자동으로 this.name = name 해줌.
class Obj5 {
    name;
    //   constructor(public name: string) {}
    constructor(name) {
        this.name = name;
    }
}
class AC {
    hello;
    constructor(hello) {
        this.hello = hello;
    }
}
const ac = {
    hello: 'hello',
};
function main2(ac) { }
main2({
    hello: 'hihi',
});
// 다른 언어에서는 보통, interface를 먼저 두고, class를 두지만 TS에서는 굳이 interface를 따로 선언하지 않음.
// 구조적 타이핑 때문임.
// abstract class가 좋은 점
// 1. private, protected 같은 접근 제어자 사용 가능
// 2. 내부에 로직을 작성할 수 있음.
class AC2 {
    hello;
    constructor(hello) {
        this.hello = hello;
    }
    sayHello() {
        // 로직 작성 가능
    }
}
// 인터페이스는 다중 상속이 가능하다.
class A {
    walk() {
        console.log('걷는다');
    }
    run() {
        console.log('뛴다');
    }
}
// 이 코드들이 다음과 같이 변환된다 생각하면 됨.
class Walk {
    walk() {
        throw new Error('하위 클래스에서 구현해주세요.');
    }
}
class Run {
    run() {
        throw new Error('하위 클래스에서 구현해주세요.');
    }
}
// 이렇게 다중 상속이 안되는 문제가 생김..
// class C extends Walk, Run {}
// 그래서 이런 경우에는 중간 클래스를 하나 두어서 처리함.
// 아래와 같이 형태로 처리된다.
class RunAndWalk extends Walk {
    run() {
        throw new Error('하위 클래스에서 구현해주세요.');
    }
}
class C extends RunAndWalk {
    walk() {
        console.log('걷는다');
    }
    run() {
        console.log('뛴다');
    }
}
export {};
