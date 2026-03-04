import type { IGrimpan } from './AbstractGrimpan';

class ChromeGrimpan implements IGrimpan {
  private static instance: ChromeGrimpan;
  // interface로 implements를 하게 되면 이 부분이 모든 Class에서 중복으로 작성되어야 함
  // 그래서 이 경우엔 abstract class로 상속받는 게 더 편할 수 있음
  private constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
  }

  initialize() {}
  initializeMenu() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector('#canvas'));
    }
    return this.instance;
  }
}

export default ChromeGrimpan;
