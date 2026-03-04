import ChromeGrimpan from './ChromeGrimpan';
import AbstractGrimpanFactory from './Factory/AbstractGrimpanFactory';
import IEGrimpan from './IEGrimpan';

// simple factory pattern
/**
 *  factory 패턴은 보통 type 등을 받아서 그에 맞는 객체를 반환하는 패턴.
 */
// function grimpanFactory(type: string) {
//   if (type === 'ie') {
//     return IEGrimpan.getInstance();
//   } else if (type === 'chrome') {
//     return ChromeGrimpan.getInstance();
//   } else if (type === 'safari') {
//     // safariGrimpan.getInstance() 등등
//   } else {
//     throw new Error('일치하는 타입이 없습니다.');
//   }
// }

/**
 * 하지만 위 grimpanFactory는 단일책임원칙(SRP)를 위반한다.
 * - 새로운 그림판 추가하려면 else if로 하나 추가해야 함 (safari처럼)
 * - 그림판을 만드는 방법이 바뀌면, getInstance에 예를 들어 인수를 추가하는 등, 또 수정을 해야 한다.
 *   - 특히 ie는 a, b를 받아야 하고 chrome은 w, h를 받아야 한다면..? type 말고 options라는 걸 또 추가해야 하고
 *   - 그 옵션의 타입은 {a: number, b: number} | {w: number, h: number} 이런식으로 또 만들어야 할 수도 있음.
 *   - 그러면 크롬일 때에는 w,h가 적용되도록, ie일때는 a,b가 적용되도록 또 코드를 더 복잡하게 짜야 함. 단지 타입 때문에.
 *   - 이토록 문제가 많기 때문에, 간단한 팩토리 패턴이기는 하지만 좋은 방법이 아닌 것....
 * - 즉, 변경의 이유가 하나가 아니게 되므로 SRP 위반이 됨
 * - 물론, 현업에서는 실제로 SRP를 완벽히 지키기 어려움...
 */

/**
 * 추가로 OCP 원칙 (개방-폐쇄 원칙)도 위반한다.
 * - 새로운 그림판 추가하려면, 기존 코드를 수정해야 함. (grimpanFactory 함수)
 * - OCP 원칙은 "소프트웨어 요소는 확장에는 열려 있어야 하지만, 변경에는 닫혀 있어야 한다"는 원칙.
 * - 즉, 새로운 기능을 추가할 때 기존 코드를 수정하지 않고도 확장할 수 있어야 한다는 것.
 * - grimpanFactory 함수는 새로운 그림판을 추가할 때마다 기존 코드를 수정해야 하므로 OCP 원칙도 위반한다.
 * - 아래와 같이 class 형태의 팩토리 패턴을 사용하면, OCP 원칙을 지킬 수 있다.
 */

// 따라서, 다음과 같이 팩토리 패턴을 사용할 수 있음
// 보통은 따로 파일을 분리하지만, 일단 여기서 임시적으로 사용.
class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return ChromeGrimpan.getInstance();
  }
}

class IEGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return IEGrimpan.getInstance();
  }
}

// 만약, 새로운 safari 그림판이 추가되면, if-else가 아니라 새로운 class 하나 만들어주면 되는 것.
// (예시)
// class SafariGrimpanFactory extends AbstractGrimpanFactory {
//   static override createGrimpan() {
//     return SafariGrimpan.getInstance();
//   }
// }

function main() {
  // simple factory 패턴을 사용하는 경우
  //   grimpanFactory('ie');
  //   grimpanFactory('chrome');
  const grimpan = ChromeGrimpanFactory.createGrimpan();
  grimpan.initialize();
  grimpan.initializeMenu();
}
main();
