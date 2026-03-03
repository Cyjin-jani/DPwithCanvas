// class Grimpan {
//   constructor(canvas: HTMLCanvasElement | null) {
//     if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
//       throw new Error('canvas 엘레먼트를 넣어주세요.');
//     }
//   }
export {};
//   initialize() {}
//   initializeMenu() {}
// }
// new Grimpan(document.querySelector('#canvas'));
// 여기서 문제..!
// 다음과 같이 수도 없이 많이 Grimpan 인스턴스를 생성할 수 있음.
// new Grimpan(document.querySelector('#canvas'));
// new Grimpan(document.querySelector('#canvas'));
// new Grimpan(document.querySelector('#canvas'));
// new Grimpan(document.querySelector('#canvas'));
// new Grimpan(document.querySelector('#canvas'));
// 그러면, 각 인스턴스는 서로 다른 상태를 가지므로, 어떤 canvas에서는 직선, 어떤 canvas에서는 원이 따로 있게 됨.
// 여기서 필요한 것이 singleton 패턴.
