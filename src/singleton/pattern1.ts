// [비추천] Singleton 구현 1 - 외부 인스턴스 변수를 만들어 사용하는 방법.
let instance: Grimpan1;

class Grimpan1 {
  constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  // 예시 메서드들
  initialize() {}
  initializeMenu() {}
}

const grimPan1 = new Grimpan1(document.querySelector('#canvas'));
const grimPan2 = new Grimpan1(document.querySelector('#canvas'));

console.log(grimPan1 === grimPan2); // true

/**
 * 단점
 * - 우선, instance 변수와 class Grimpan이 멀리 떨어져 있음. (위 예시에선 붙어있지만) 같은 기능의 코드가 여러 파일에 흩어져 있을 수 있음.
 */

// instance를 단순히 class 안에 넣으면..? 에러는 차치하고라도 그러면 false가 나옴.
// 클래스 내부의 속성은 그 객체별로 다르게 가져가기 때문에.
// class Grimpan {
//   instance;
//   constructor(canvas: HTMLCanvasElement | null) {
//     if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
//       throw new Error('canvas 엘레먼트를 넣어주세요.');
//     }
//     if (!this.instance) {
//       this.instance = this;
//     }
//     return this.instance;
//   }
// }

// const grimPan1 = new Grimpan(document.querySelector('#canvas'));
// const grimPan2 = new Grimpan(document.querySelector('#canvas'));

// console.log(grimPan1 === grimPan2); // false
