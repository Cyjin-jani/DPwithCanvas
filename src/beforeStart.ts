// 추상 클래스, 인터페이스, 구조적 타이핑

// 인터페이스
interface Obj {
  name: string;
}

// 변수에 할당한 객체의 경우
const obj: Obj = {
  name: 'object',
  // age: 1, // 인터페이스에 적혀져 있지 않은 프로퍼티는 에러
};

// 함수의 경우 1 - 직접 객체를 전달하는 경우, 타입 검사로 인해 age 프로퍼티는 에러
function main(obj: Obj) {}
main({
  name: 'object',
  // age: 1 // 인터페이스에 적혀져 있지 않은 프로퍼티는 에러
});

const obj2 = {
  name: 'object',
  age: 1,
};
main(obj2);
// 외부에 변수로 선언된 객체는 인터페이스에 적혀져 있지 않은 프로퍼티가 있어도 에러가 나지 않음
// 객체 자체를 매개변수로 넣으면 에러가 나는 것과 다름.
// 객체 리터럴은 잉여 속성 검사를 하고, 변수는 잉여 속성 검사를 하지 않기 때문.

interface Obj3 {
  name: string;
  getName(): string; // 메서드도 가능
  // private age: number; // 인터페이스에서는 private, protected 등의 접근 제어자 사용 불가
}

const obj3: Obj3 = {
  name: 'object',
  getName() {
    return this.name;
  },
};

// 추상 클래스
// interface의 역할도 하면서 private 같은걸 만들고 싶다면..? 그럴 때 추상 클래스를 사용

abstract class Obj4 {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

// 손쉽게 작성하려면 다음과 같이도 작성할 수 있다.
// ts에서 자동으로 this.name = name 해줌.
abstract class Obj5 {
  //   constructor(public name: string) {}
  constructor(protected readonly name: string) {}
}

abstract class AC {
  hello: string;
  constructor(hello: string) {
    this.hello = hello;
  }
}
// ts에서는 public 속성만 있으면 new Class() 같은 게 없이도 대입이 됨.
// 추상 클래스를 클래스라고 생각하지 않고, 단순 객체라고 생각하게 되는 것.
// AC 추상 클래스도 hello 라는 string을 가진 속성이 있고, const ac도 hello라는 속성이 동일하게 있기에, 구조적으로 같은 타입이라 판단
// 이것이 TS의 구조적 타이핑 (structural typing 또는 duck typing) 시스템의 특징

// 예를 들어 아래와 같이 interface가 있다고 해도, 구조가 같아서 AC와 AC2는 같은 타입으로 간주됨.
interface AC2 {
  hello: string;
}

const ac: AC = {
  hello: 'hello',
};

function main2(ac: AC) {}
main2({
  hello: 'hihi',
});

// 다른 언어에서는 보통, interface를 먼저 두고, class를 두지만 TS에서는 굳이 interface를 따로 선언하지 않음.
// 구조적 타이핑 때문임.

// abstract class가 좋은 점
// 1. private, protected 같은 접근 제어자 사용 가능
// 2. 내부에 로직을 작성할 수 있음.
abstract class AC2 {
  hello: string;
  constructor(hello: string) {
    this.hello = hello;
  }
  sayHello() {
    // 로직 작성 가능
  }
}

// 다만, abstract class도 단점이 있음..

// interface는 주로 행동들을 많이 만듦
interface Walkable {
  walk(): void;
}

interface Runnable {
  run(): void;
}

// 인터페이스는 다중 상속이 가능하다.
class A implements Walkable, Runnable {
  walk() {
    console.log('걷는다');
  }
  run() {
    console.log('뛴다');
  }
}

// 하지만 추상 클래스는 아래와 같이 다중 상속이 안되는 단점이 있음.
// abstract class ACC {}
// class B extends AC, ACC {}

// 강사는 보통 추상 클래스를 사용하지만, 위의 예시처럼 다중 구현이 필요한 경우에는 인터페이스를 사용한다.

// 추상 클래스를 쓰는 또 다른 이유.
// 추상 클래스는 js로 변환되어도 class로 남음. 다만 interface는 좀 애매할 수 있다.
// 아래의 경우를 보자.

interface Walk {
  walk(): void;
}

interface Run {
  run(): void;
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
  override walk() {
    console.log('걷는다');
  }
  override run() {
    console.log('뛴다');
  }
}
