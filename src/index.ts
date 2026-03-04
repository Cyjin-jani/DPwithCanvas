import ChromeGrimpan from './ChromeGrimpan';
import IEGrimpan from './IEGrimpan';

// simple factory pattern
/**
 *  factory 패턴은 보통 type 등을 받아서 그에 맞는 객체를 반환하는 패턴.
 */
function grimpanFactory(type: string) {
  if (type === 'ie') {
    return IEGrimpan.getInstance();
  } else if (type === 'chrome') {
    return ChromeGrimpan.getInstance();
  } else if (type === 'safari') {
    // safariGrimpan.getInstance() 등등
  } else {
    throw new Error('일치하는 타입이 없습니다.');
  }
}

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

function main() {
  grimpanFactory('ie');
  grimpanFactory('chrome');
}
main();
