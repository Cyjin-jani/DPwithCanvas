export class GrimpanMenuBtn {
    menu;
    name;
    type; // 지우개, 펜 등
    onClick;
    onChange;
    active;
    value;
    constructor(menu, name, type, onClick, onChange, active, value) {
        this.menu = menu;
        this.name = name;
        this.type = type;
        this.onClick = onClick;
        this.onChange = onChange;
        this.active = active;
        this.value = value;
    }
    draw() {
        if (this.type === 'button') {
            const btn = document.createElement('button');
            btn.textContent = this.name;
            if (this.onClick) {
                btn.addEventListener('click', this.onClick.bind(this));
            }
            this.menu.dom.append(btn);
        }
        else if (this.type === 'input') {
            const input = document.createElement('input');
            input.title = this.name;
            input.type = 'color'; // 임시로 처리. (당장은 type이 color만 있어서.)
            if (this.onChange) {
                input.addEventListener('change', this.onChange.bind(this));
            }
            this.menu.dom.append(input);
        }
    }
    // 왜 builder를 안에다 만드는가?
    // - 만약 크폼 빌더, 사파리 빌더 등이 필요하다면 따로 빼서 만들고, 어떤 빌더를 선택할지 고르도록 할 수 있다.
    // 빌더교체 예시.ts를 참고해라..
    static Builder = class GrimpanMenuBtnBuilder {
        btn;
        // 필수값들은 그냥 바로 constructor에서 처리함.
        constructor(menu, name, type) {
            this.btn = new GrimpanMenuBtn(menu, name, type);
        }
        setOnClick(onClick) {
            this.btn.onClick = onClick;
            return this; // method chaining을 위해 this 반환
        }
        setOnChange(onChange) {
            this.btn.onChange = onChange;
            return this;
        }
        setActive(active) {
            this.btn.active = active;
            return this;
        }
        setValue(value) {
            this.btn.value = value;
            return this;
        }
        build() {
            return this.btn;
        }
    };
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
