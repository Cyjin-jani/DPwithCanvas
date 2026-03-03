class Grimpan3 {
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
            this.instance = new Grimpan3(canvas);
        }
        return this.instance;
    }
}
export default Grimpan3;
// 다른 파일에서 import해서 사용한다면..
// import Grimpan3 from './pattern3.js;
// const grimPan1 = Grimpan3.getInstance(document.querySelector('#canvas'));
// const grimPan2 = Grimpan3.getInstance(document.querySelector('#canvas'));
// console.log(grimPan1 === grimPan2); // true
