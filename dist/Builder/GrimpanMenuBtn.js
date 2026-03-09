class GrimpanMenuElementBuilder {
    btn;
    constructor() { }
    build() {
        return this.btn;
    }
}
export class GrimpanMenuElement {
    menu;
    name;
    type;
    constructor(menu, name, type) {
        this.menu = menu;
        this.name = name;
        this.type = type;
    }
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
    onChange;
    value;
    constructor(menu, name, type, onChange, value) {
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
        btn;
        constructor(menu, name, type) {
            super();
            this.btn = new GrimPanMenuInput(menu, name, type);
        }
        setOnChange(onChange) {
            this.btn.onChange = onChange;
            return this;
        }
        setValue(value) {
            this.btn.value = value;
            return this;
        }
    };
}
export class GrimPanMenuBtn extends GrimpanMenuElement {
    onClick;
    active;
    constructor(menu, name, type, onClick, active) {
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
        btn;
        constructor(menu, name, type) {
            super();
            this.btn = new GrimPanMenuBtn(menu, name, type);
        }
        setOnClick(onClick) {
            this.btn.onClick = onClick;
            return this; // method chaining을 위해 this 반환
        }
        setActive(active) {
            this.btn.active = active;
            return this;
        }
    };
}
