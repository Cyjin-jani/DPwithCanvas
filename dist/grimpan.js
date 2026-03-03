// ! 다른 곳에서 new Grimpan(document.querySelector('#canvas'))등 별도 인스턴스를 만들어 사용하지 못하도록 하기 위해 private으로 처리함.
class Grimpan {
    static instance;
    constructor(canvas) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
    }
    initialize() { }
    initializeMenu() { }
    static getInstance(canvas) {
        if (!this.instance) {
            this.instance = new Grimpan(canvas);
        }
        return this.instance;
    }
}
export default Grimpan;
