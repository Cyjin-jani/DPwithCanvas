// js의 export - import 모듈 시스템을 이용하는 방법.
class Grimpan2 {
  constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
  }
  initialize() {}
  initializeMenu() {}
}

export default new Grimpan2(document.querySelector('#canvas'));

// 다른 파일에서 import해서 사용하기
// import grimPan1 from './pattern2.js;
// import grimPan2 from './pattern2.js;
// console.log(grimPan1 === grimPan2); // true

/**
 * JS 모듈 시스템의 패턴을 이용한 것.
 * - <script type="module">을 사용하면, 그 자체로 싱글턴 패턴이 됨.
 * - 그래서 여러 파일에서 불러와서 사용해도, 같은 인스턴스 하나를 공유하게 됨.
 * - 자바스크립트 모듈은 그 자체가 싱글턴이기 때문.
 */
