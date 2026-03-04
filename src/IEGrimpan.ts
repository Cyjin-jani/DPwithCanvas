import AbstractGrimpan from './Factory/AbstractGrimpan';

class IEGrimpan extends AbstractGrimpan {
  private static instance: IEGrimpan;

  initialize() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEGrimpan(document.querySelector('#canvas'));
    }
    return this.instance;
  }
}

export default IEGrimpan;
