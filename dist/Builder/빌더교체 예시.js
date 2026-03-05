// /**
//  * 만약, 빌더를 외부에 따로 만들고 싶다면 다음과 같이 할 수 있다.
//  */
export {};
// class GrimpanMenuBtn {
//   name?: string | undefined;
//   type?: string | undefined; // 지우개, 펜 등
//   onClick?: (() => void) | undefined;
//   onChange?: (() => void) | undefined;
//   active?: boolean | undefined;
//   value?: (string | number) | undefined;
//   constructor(
//     name?: string,
//     type?: string,
//     onClick?: () => void,
//     onChange?: () => void,
//     active?: boolean,
//     value?: string | number,
//   ) {
//     this.name = name;
//     this.type = type;
//     this.onClick = onClick;
//     this.onChange = onChange;
//     this.active = active;
//     this.value = value;
//   }
// }
// // 먼저 인터페이스 선언
// interface IGrimpanMenuBtnBuilder {
//   setName(name: string): this;
//   setType(type: string): this;
//   setOnClick(onClick: () => void): this;
//   setOnChange(onChange: () => void): this;
//   setActive(active: boolean): this;
//   setValue(value: string | number): this;
//   build(): GrimpanMenuBtn;
// }
// // 다양한 빌더 클래스를 만들 수 있음.
// class ChromeGrimpanMenuBtnBuilder implements IGrimpanMenuBtnBuilder {
//   btn: GrimpanMenuBtn;
//   constructor() {
//     this.btn = new GrimpanMenuBtn();
//   }
//   setName(name: string) {
//     this.btn.name = name;
//     return this;
//   }
//   setType(type: string) {
//     this.btn.type = type;
//     return this;
//   }
//   setOnClick(onClick: () => void) {
//     this.btn.onClick = onClick;
//     return this;
//   }
//   setOnChange(onChange: () => void) {
//     this.btn.onChange = onChange;
//     return this;
//   }
//   setActive(active: boolean) {
//     this.btn.active = active;
//     return this;
//   }
//   setValue(value: string | number) {
//     this.btn.value = value;
//     return this;
//   }
//   build() {
//     return this.btn;
//   }
// }
// class IEGrimpanMenuBtnBuilder implements IGrimpanMenuBtnBuilder {
//   btn: GrimpanMenuBtn;
//   constructor() {
//     this.btn = new GrimpanMenuBtn();
//   }
//   setName(name: string) {
//     this.btn.name = name;
//     return this;
//   }
//   setType(type: string) {
//     this.btn.type = type;
//     return this;
//   }
//   setOnClick(onClick: () => void) {
//     this.btn.onClick = onClick;
//     return this;
//   }
//   setOnChange(onChange: () => void) {
//     this.btn.onChange = onChange;
//     return this;
//   }
//   setActive(active: boolean) {
//     this.btn.active = active;
//     return this;
//   }
//   setValue(value: string | number) {
//     this.btn.value = value;
//     return this;
//   }
//   build() {
//     return this.btn;
//   }
// }
// // 버튼 생성에 대한 책임이 director로 넘어감.
// export class GrimpanMenuBtnDirector {
//   static createBackBtn(builder: IGrimpanMenuBtnBuilder) {
//     const backBtnBuilder = builder
//       .setName('뒤로가기')
//       .setType('back')
//       .setOnClick(() => {})
//       .setActive(false);
//     return backBtnBuilder;
//   }
//   static createForwardBtn(builder: IGrimpanMenuBtnBuilder) {
//     const forwardBtnBuilder = builder
//       .setName('앞으로')
//       .setType('forward')
//       .setOnClick(() => {})
//       .setActive(false);
//     return forwardBtnBuilder;
//   }
// }
// GrimpanMenuBtnDirector.createBackBtn(new ChromeGrimpanMenuBtnBuilder());
// GrimpanMenuBtnDirector.createForwardBtn(new IEGrimpanMenuBtnBuilder());
