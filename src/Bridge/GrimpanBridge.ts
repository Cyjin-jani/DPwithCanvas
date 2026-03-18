// 브릿지 패턴
// 조합이 다양하게 될 경우에, 클래스의 개수를 줄이고 (조합의 개수를 줄이고)
// 사용자가 관심있어 하는 부분만 드러낼 수 있는 패턴

// 만약 추상 클래스로 그림판이 있고,
// abstract class Grimpan {}

// 이렇게 용도별 그림판 유형과
// class PremiumGrimpan extends Grimpan {}
// class BasicGrimpan extends Grimpan {}
// class ExpertGrimpan extends Grimpan {}

// os별 그림판이 있다고 하면
// class ChromeGrimpan extends Grimpan {}
// class IEGrimpan extends Grimpan {}
// class SafariGrimpan extends Grimpan {}

// 3*3이라서 아래와 같이 9개의 그림판을 만들어야 하는 미친짓을 해야함.
// 심지어 조합 경우의수는 더 늘어날 수 있음.

// class PremiumChromeGrimpan {}
// class PremiumIEGrimpan {}
// class PremiumSafariGrimpan {}

// class BasicChromeGrimpan {}
// class BasicIEGrimpan {}
// class BasicSafariGrimpan {}

// class ExpertChromeGrimpan {}
// class ExpertIEGrimpan {}
// class ExpertSafariGrimpan {}

// 클라이언트가 관심 있어하는 부분과 없어하는 부분을 나눠야 함
// 관심 있는거 : 어떤 용도 유형
// 관심 없는거 : 플랫폼별 유형 (내 OS에 맞춰 자동으로 되길 원함. 신경쓰고 싶지 않음)

// 그래서 이렇게 함

// abstract class GrimpanPlatform {}

// abstract class Grimpan {
//   constructor(public readonly platform: GrimpanPlatform) {}
// }

// class PremiumGrimpan extends Grimpan {}
// class BasicGrimpan extends Grimpan {}
// class ExpertGrimpan extends Grimpan {}

// class ChromeGrimpan extends GrimpanPlatform {}
// class IEGrimpan extends GrimpanPlatform {}
// class SafariGrimpan extends GrimpanPlatform {}

// 실제 사용시
// 구현 부분을 생성자의 매개변수로 넣어버리는 것..!
// 이건 상속이 아니라 합성이라고 부름.

// 9개의 클래스가 아니라 조합해서 쓰는 것. (3 * 3 이 아니라 3 + 3이 됨)
// 20개씩 있다고 하면, 400개와 40개의 차이..!
// new PremiumGrimpan(new ChromeGrimpan())
// new PremiumGrimpan(new IEGrimpan())
// new PremiumGrimpan(new SafariGrimpan())
