import ChromeGrimpan from '../ChromeGrimpan';
import IEGrimpan from '../IEGrimpan';
import type Grimpan from './AbstractGrimpan';
import { ChromeGrimpanHistory, IEGrimpanHistory } from './GrimpanHistory';
import { ChromeGrimpanMenu, IEGrimpanMenu } from './GrimpanMenu';

// 추상 클래스에서는 타입도 추상 클래스를 가져와야 함.
// import IEGrimpan from '../IEGrimpan' 해서,
// !! 구현체인 IEGrimpan을 타입으로 쓴다던가 하면 안됨!
// abstract class는 interface라고 생각하면 됨.
// 단지, interface는 구현이 안되고, abstract class는 구현이 될 수 있다는 점이 다름.
// 실제로 AbstractGrimpan을 가보면, constructor 내부에 구현이 일부 되어있음.
// abstract class AbstractGrimpanFactory {
//   abstract createGrimpan(): Grimpan;
// }

// export default AbstractGrimpanFactory;

//다만, static으로 create를 사용하기 위해 다음과 같이 변경함.
// (원래는 리스코프 치환 원칙 위반이 될 수 있지만, 이건 abstract class여서 그냥 넘어가기로 함.)
export abstract class AbstractGrimpanFactory {
  static createGrimpan() {
    throw new Error('하위 클래스에서 구현해주세요.');
  }

  static createGrimpanMenu(grimpan: Grimpan) {
    throw new Error('하위 클래스에서 구현해주세요.');
  }

  static createGrimpanHistory(grimpan: Grimpan) {
    throw new Error('하위 클래스에서 구현해주세요.');
  }
}

export class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return ChromeGrimpan.getInstance();
  }

  static override createGrimpanMenu(grimpan: ChromeGrimpan) {
    return ChromeGrimpanMenu.getInstance(grimpan);
  }

  static override createGrimpanHistory(grimpan: ChromeGrimpan) {
    return ChromeGrimpanHistory.getInstance(grimpan);
  }
}

export class IEGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return IEGrimpan.getInstance();
  }

  static override createGrimpanMenu(grimpan: IEGrimpan) {
    return IEGrimpanMenu.getInstance(grimpan);
  }

  static override createGrimpanHistory(grimpan: IEGrimpan) {
    return IEGrimpanHistory.getInstance(grimpan);
  }
}
