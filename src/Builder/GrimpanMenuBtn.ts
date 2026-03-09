import type { BtnType, GrimpanMenu } from '../Factory/GrimpanMenu';

abstract class GrimpanMenuElementBuilder {
  btn!: GrimPanMenuBtn;
  constructor() {}

  build() {
    return this.btn;
  }
}

export abstract class GrimpanMenuElement {
  protected menu: GrimpanMenu;
  protected name: string;
  protected type: BtnType;

  protected constructor(menu: GrimpanMenu, name: string, type: BtnType) {
    this.menu = menu;
    this.name = name;
    this.type = type;
  }

  abstract draw(): void;
}

/**
 * 다음과 같이 사용할 수 있다.
 * 빌드 패턴의 좋은 점
 * - 필수가 뭔지 구별할 수 있음 (Builder의 constructor에서 필수값을 받도록 하면 됨)
 * - 최종적으로 build를 했다면, 이 객체가 완성된 객체(버튼)임을 알 수 있음. (build 메서드가 완성된 객체를 반환하기 때문)
 * - build()가 없으면, 반환되는 타입 자체가 builder가 됨. 그래서 코드 상으로도 완성된 객체인지 아닌지 구별이 가능함!
 * - 객체를 생성할 때, 오래걸리는 작업이 있다면, 중간에 멈췄다가 최종적으로 build()를 사용하여 객체를 생성할 수도 있음.
 */
// const btn = new GrimpanMenuBtn.Builder('펜', 'pen')
//   .setOnClick(() => {})
//   .setActive(false)
//   .build();

export class GrimPanMenuInput extends GrimpanMenuElement {
  private onChange?: ((e: Event) => void) | undefined;
  private value?: (string | number) | undefined;

  private constructor(
    menu: GrimpanMenu,
    name: string,
    type: BtnType,
    onChange?: () => void,
    value?: string | number,
  ) {
    super(menu, name, type);
    this.onChange = onChange;
    this.value = value;
  }

  draw() {
    const input = document.createElement('input');
    input.title = this.name;
    input.type = 'color';
    input.id = 'color-btn';
    if (this.onChange) {
      input.addEventListener('change', this.onChange.bind(this));
    }
    this.menu.colorBtn = input;
    this.menu.dom.append(input);
  }

  static Builder = class GrimpanMenuInputBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimPanMenuInput;

    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimPanMenuInput(menu, name, type);
    }

    setOnChange(onChange: (e: Event) => void) {
      this.btn.onChange = onChange;
      return this;
    }

    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }
  };
}

export class GrimPanMenuBtn extends GrimpanMenuElement {
  private onClick?: (() => void) | undefined;
  private active?: boolean | undefined;

  private constructor(
    menu: GrimpanMenu,
    name: string,
    type: BtnType,
    onClick?: () => void,
    active?: boolean,
  ) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
    this.type = type;
  }

  draw() {
    const btn = document.createElement('button');
    btn.textContent = this.name;
    btn.id = `${this.type}-btn`;
    if (this.onClick) {
      btn.addEventListener('click', this.onClick.bind(this));
    }
    this.menu.dom.append(btn);
  }

  static Builder = class GrimpanMenuBtnBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimPanMenuBtn;

    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimPanMenuBtn(menu, name, type);
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this; // method chaining을 위해 this 반환
    }

    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
  };
}
