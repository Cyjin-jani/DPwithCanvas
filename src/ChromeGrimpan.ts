import AbstractGrimpan from './Factory/AbstractGrimpan';

class ChromeGrimpan extends AbstractGrimpan {
  // 다른 곳에서 new ChromeGrimpan(document.querySelector('#canvas'))등 별도 인스턴스를 만들어 사용하지 못하도록 하기 위해 private으로 처리함
  private static instance: ChromeGrimpan;

  initialize() {}
  initializeMenu() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector('#canvas'));
    }
    return this.instance;
  }
}

export default ChromeGrimpan;
