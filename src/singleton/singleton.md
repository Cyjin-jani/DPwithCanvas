만약 다음과 같은 코드가 있다고 가정해보자.

```ts
class Grimpan {
  constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
  }

  initialize() {}
  initializeMenu() {}
}

new Grimpan(document.querySelector('#canvas'));
```

여기서 문제..!
다음과 같이 수도 없이 많이 Grimpan 인스턴스를 생성할 수 있음.

```ts
new Grimpan(document.querySelector('#canvas'));
new Grimpan(document.querySelector('#canvas'));
new Grimpan(document.querySelector('#canvas'));
new Grimpan(document.querySelector('#canvas'));
new Grimpan(document.querySelector('#canvas'));
```

그러면, 각 인스턴스는 서로 다른 상태를 가지므로, 어떤 canvas에서는 직선, 어떤 canvas에서는 원이 따로 있게 됨.
여기서 필요한 것이 singleton 패턴이다.

싱글턴(Singleton) 패턴은, 하나의 인스턴스만 존재함을 보장한다

특징

- 생성자도 private으로(자바스크립트에서는 symbol 사용해서 생성자 호출 막기)
  - private이기 때문에 테스트가 어려워진다.
- 단일 책임 원칙 위반!
  - 다음 코드를 살펴보면, 책임이 하나가 아닌 걸 알 수 있다.

  ```ts
  static getInstance() {
    if (!this.instance) {
      this.instance = new Grimpan(document.querySelector('#canvas'));
    }
    return this.instance;
  }
  ```

  - Grimpan 인스턴스를 생성하는 역할
  - 인스턴스가 하나인지를 판별하는 역할 (유일한 인스턴스를 보장)
  - 단일 책임 원칙은, 단일 책임이 뭔지 구분이 어렵기 때문에, 바꿔야 되는 상황에서 바꿔야 되는 이유가 한 가지 이다...라고 생각하면 됨.
    - ex: 인스턴스 생성 방식 변경하고 싶으면? new Grimpan 부분을 변경하면 된다.
    - ex: 만약 유일한 인스턴스가 아니라 2개까지 가능하다? 그러면 getInstance를 또 바꿔줘야한다.
    - 그래서 함수 역할은 2가지.

- 강결합으로 인해 테스트하기 어려움
  - 보통 import 해서 아래와 같이 사용하게 될 것.

    ```ts
    import Grimpan from './Grimpan';

    function main() {
      Grimpan.getInstance().initialize();
    }
    main();
    ```

    - 이런 상태가 바로 강결합된 상태.

  - 강결합 되지 않은 유연한 상태는? 다음과 같다.

    ```ts
    import Grimpan from './Grimpan';

    function main(instance: any) {
      instance.initialize();
    }
    main(Grimpan.getInstance());
    main(Editor.getInstance());
    main(MSPaint.getInstance());
    ```

    예를 들어 다음과 같이 사용 시 테스트가 용이할 것이다.

    ```ts
    import Grimpan from './Grimpan';

    function main(instance: any) {
      instance.initialize();
    }
    main(TestGrimpan.getInstance()); // 테스트를 위해.
    ```

- ts를 쓰지 않는 JS의 경우는 어떻게 해야 하나? Symbol을 이용하자!

  ```ts
  const CONST_GRIMPAN_SYMBOL = Symbol();

  class Grimpan {
    static instance;
    constructor(canvas, symbol) {
      if (symbol !== CONST_GRIMPAN_SYMBOL) {
        throw new Error('new를 통해 호출할 수 없습니다.');
      }
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas 엘레먼트를 넣어주세요.');
      }
    }
    initialize() {}
    initializeMenu() {}
    static getInstance() {
      if (!this.instance) {
        this.instance = new Grimpan(document.querySelector('#canvas'), CONST_GRIMPAN_SYMBOL);
      }
      return this.instance;
    }
  }

  export default Grimpan;
  ```

  - symbol의 특성을 이용해서 private constructor를 만들 수 있음.
