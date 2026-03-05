class Grimpan {
    constructor(canvas) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
    }
    static getInstance() { }
}
export default Grimpan;
