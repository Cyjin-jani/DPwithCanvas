import type { BtnType, GrimpanMenu } from '../Factory/GrimpanMenu';

abstract class GrimpanMenuElementBuilder {
  btn!: GrimpanMenuElement;
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

  draw() {
    const btn = this.createButton();
    this.appendBeforeBtn();
    this.appendToDOM(btn);
    this.appendAfterBtn();
  }

  abstract createButton(): HTMLElement;
  abstract appendBeforeBtn(): void;
  abstract appendToDOM(btn: HTMLElement): void;
  abstract appendAfterBtn(): void;
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

  createButton() {
    const btn = document.createElement('input');
    btn.title = this.name;
    btn.type = 'color';
    btn.id = 'color-btn';
    if (this.onChange) {
      btn.addEventListener('change', this.onChange.bind(this));
    }
    return btn;
  }
  appendBeforeBtn() {}
  appendAfterBtn() {}

  appendToDOM(btn: HTMLInputElement) {
    this.menu.colorBtn = btn;
    this.menu.dom.append(btn);
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
  protected onClick?: (() => void) | undefined;
  protected active?: boolean | undefined;

  protected constructor(
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

  createButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = this.name;
    btn.id = `${this.type}-btn`;
    if (this.onClick) {
      btn.addEventListener('click', this.onClick.bind(this));
    }
    return btn;
  }

  appendBeforeBtn() {
    // 자식 로직
  }
  appendAfterBtn() {}

  appendToDOM(btn: HTMLButtonElement) {
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

export class GrimPanMenuSaveBtn extends GrimPanMenuBtn {
  private onClickBlur!: (e: Event) => void; // 이미지 흐리게
  private onClickInvert!: (e: Event) => void; // 이미지 반전
  private onClickGrayScale!: (e: Event) => void; // 이미지 흑백으로

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
  }

  // draw를 override한게 없어지고, 아래 함수만 남음
  // draw가 없으면, 부모것을 찾아가게 됨. 부모에서 자식꺼 override한게 있나 보고 없으면 부모꺼 실행.
  // draw()를 하면, 아래처럼 appendBeforeBtn만 자식의 함수를 이용해서 처리함.
  // 템플릿 메서드 패턴은 이처럼 장점도 있지만,
  // 단점은, 부모와의 상속 구조가 복잡해질수록 코드의 위치 등 거리가 멀어지므로 코드 파악이 어려울 수 있음 (가독성 이슈)
  override appendBeforeBtn(): void {
    this.drawInput('블러', this.onClickBlur);
    this.drawInput('흑백', this.onClickGrayScale);
    this.drawInput('반전', this.onClickInvert);
  }

  drawInput(title: string, onChange: (e: Event) => void) {
    const input = document.createElement('input') as HTMLInputElement;
    input.title = title;
    input.type = 'checkbox';
    input.addEventListener('change', onChange.bind(this));

    this.menu.dom.append(input);
  }

  static override Builder = class GrimpanMenuSaveBtnBuilder extends GrimpanMenuElementBuilder {
    override btn: GrimPanMenuSaveBtn;

    constructor(menu: GrimpanMenu, name: string, type: BtnType) {
      super();
      this.btn = new GrimPanMenuSaveBtn(menu, name, type);
    }

    setFilterListeners(listeners: {
      [key in 'blur' | 'invert' | 'grayscale']: (e: Event) => void;
    }) {
      this.btn.onClickBlur = listeners.blur;
      this.btn.onClickInvert = listeners.invert;
      this.btn.onClickGrayScale = listeners.grayscale;
      return this;
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
