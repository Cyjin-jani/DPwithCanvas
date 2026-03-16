// menu 그리는 함수들을 이 클래스에서만 하도록 (단일책임 원칙)
export class MenuDrawVisitor {
}
// visitor 패턴의 단점은, 외부로 로직을 빼야 하기 떄문에, 기존 class 속성에 접근을 해야 함.
// 이때, private이나 protected인 경우 접근을 할 수 없으므로 접근이 필요한 모든 속성에 대해 public으로 수정해줘야 함.
export class ChromeMenuDrawVisitor extends MenuDrawVisitor {
    drawBtn(btn) {
        const btnElement = document.createElement('button');
        btnElement.textContent = btn.name;
        btnElement.id = `${btn.type}-btn`;
        if (btn.onClick) {
            btnElement.addEventListener('click', btn.onClick.bind(btn));
        }
        btn.menu.dom.append(btnElement);
        return btnElement;
    }
    drawInput(input) {
        const inputElement = document.createElement('input');
        inputElement.type = 'color';
        inputElement.title = input.name;
        inputElement.id = 'color-btn';
        if (input.onChange) {
            inputElement.addEventListener('change', input.onChange.bind(input));
        }
        input.menu.colorBtn = inputElement;
        input.menu.dom.append(inputElement);
        return inputElement;
    }
    drawSaveBtn(btn) {
        const btnElement = document.createElement('button');
        btnElement.textContent = btn.name;
        btnElement.id = `${btn.type}-btn`;
        if (btn.onClick) {
            btnElement.addEventListener('click', btn.onClick.bind(btn));
        }
        // drawFilter에서 최종적으로 bind를 해주므로, 여기서는 bind를 할 필요가 없음
        this.drawFilter(btn, '블러', btn.onClickBlur);
        this.drawFilter(btn, '흑백', btn.onClickGrayScale);
        this.drawFilter(btn, '반전', btn.onClickInvert);
        btn.menu.dom.append(btnElement);
        return btnElement;
    }
    drawFilter(btn, title, onChange) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.title = title;
        input.addEventListener('change', onChange.bind(btn));
        btn.menu.dom.append(input);
    }
}
