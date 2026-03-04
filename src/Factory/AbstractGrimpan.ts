abstract class Grimpan {
  protected constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘레먼트를 넣어주세요.');
    }
  }

  abstract initialize(): void;

  static getInstance() {}
}

export default Grimpan;
