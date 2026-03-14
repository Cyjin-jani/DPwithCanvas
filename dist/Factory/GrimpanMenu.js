import { GrimPanMenuInput, GrimPanMenuBtn, GrimPanMenuSaveBtn } from '../Builder/GrimpanMenuBtn.js';
import { BackCommand, PenSelectCommand, Command, SaveCommand, ForwardCommand, SaveHistoryCommand, } from '../Commands/index.js';
import { SubscriptionManager } from '../Observer.js';
export class GrimpanMenu {
    grimpan;
    dom;
    colorBtn;
    constructor(grimpan, dom) {
        this.grimpan = grimpan;
        this.dom = dom;
        // 구독 처리
        SubscriptionManager.getInstance().subscribe('saveComplete', {
            name: 'menu',
            publish: this.afterSaveComplete.bind(this),
        });
    }
    afterSaveComplete() {
        console.log('menu: save completed');
    }
    cancelSaveCompleteAlarm() {
        SubscriptionManager.getInstance().unsubscribe('saveComplete', 'menu');
    }
    // 자식끼리 공유하는 같은 함수이므로 그냥 abstract에 구현함.
    // 자식끼리 내부 로직이 달라져야 하면 abstract로 만들고, 실제 내부 로직은 각 자식 클래스에서 구현.
    setActiveBtn(type) {
        document.querySelector('.active')?.classList.remove('active');
        document.querySelector(`#${type}-btn`)?.classList.add('active');
        // this.grimpan.setMode(type); // 순환 참조가 발생하기 때문에 여기서 없앰.
    }
    // invoker 역할의 함수
    // invoker는 조건에 따라서 command를 호출할 수도 있고, 안할수도 있음.
    // 실행에 대한 조건을 여기서 다룰 수 있음.
    executeCommand(command) {
        // 예시임
        // 비활성화 로직이 필요하다면
        // if (비활성화) return; 이런식으로 한번에 처리할 수 있음.
        // 그래서 중앙에서 command를 통제하는 이 함수가 필요.
        command.execute();
    }
    static getInstance(grimpan, dom) { }
}
export class IEGrimpanMenu extends GrimpanMenu {
    static instance;
    initialize(types) { }
    static getInstance(grimpan, dom) {
        if (!this.instance) {
            this.instance = new IEGrimpanMenu(grimpan, dom);
        }
        return this.instance;
    }
}
export class ChromeGrimpanMenu extends GrimpanMenu {
    static instance;
    initialize(types) {
        types.forEach(this.drawButtonByType.bind(this));
        this.grimpan.setMode('pen');
        // 초기 그림판 히스토리 세팅
        this.executeCommand(new SaveHistoryCommand(this.grimpan));
    }
    onSave() {
        this.executeCommand(new SaveCommand(this.grimpan));
    }
    onClickBack() {
        // new BackCommand().execute(); // 이렇게 안하고 아래와 같이 처리하는 이유?
        // 만약 여러 command가 존재하는데, 모든 버튼 비활성화 같은 기능을 만들어야 한다면?
        // 위와 같이 command.execute()를 여기에 적으면, 모든 onClickXXX (pen, rectangle, circle 등)에 대해
        // 똑같은 코드로 조건 분기처리를 작성해서 execute 여부를 관리해야 함.
        // 다만 위와 같이 invoker 함수로 두면? executeCommand 함수 안에서 한번에 처리할 수 있음.
        this.executeCommand(new BackCommand(this.grimpan.history));
    }
    onClickForward() {
        this.executeCommand(new ForwardCommand(this.grimpan.history));
    }
    onClickPen() {
        this.grimpan.setMode('pen');
    }
    onClickEraser() {
        this.grimpan.setMode('eraser');
    }
    onClickCircle() {
        this.grimpan.setMode('circle');
    }
    onClickRectangle() {
        this.grimpan.setMode('rectangle');
    }
    onClickPipette() {
        this.grimpan.setMode('pipette');
    }
    drawButtonByType(type) {
        switch (type) {
            case 'back': {
                const btn = new GrimPanMenuBtn.Builder(this, '뒤로', type)
                    .setOnClick(this.onClickBack.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'forward': {
                const btn = new GrimPanMenuBtn.Builder(this, '앞으로', type)
                    .setOnClick(this.onClickForward.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'color': {
                const btn = new GrimPanMenuInput.Builder(this, '컬러', type)
                    .setOnChange((e) => {
                    if (e.target) {
                        this.grimpan.setColor(e.target.value);
                    }
                })
                    .build();
                btn.draw();
                return btn;
            }
            case 'pipette': {
                const btn = new GrimPanMenuBtn.Builder(this, '스포이트', type)
                    .setOnClick(this.onClickPipette.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'pen': {
                const btn = new GrimPanMenuBtn.Builder(this, '펜', type)
                    .setOnClick(this.onClickPen.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'circle': {
                const btn = new GrimPanMenuBtn.Builder(this, '원', type)
                    .setOnClick(this.onClickCircle.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'rectangle': {
                const btn = new GrimPanMenuBtn.Builder(this, '사각형', type)
                    .setOnClick(this.onClickRectangle.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'eraser': {
                const btn = new GrimPanMenuBtn.Builder(this, '지우개', type)
                    .setOnClick(this.onClickEraser.bind(this))
                    .build();
                btn.draw();
                return btn;
            }
            case 'save': {
                const btn = new GrimPanMenuSaveBtn.Builder(this, '저장', type)
                    .setOnClick(this.onSave.bind(this))
                    .setFilterListeners({
                    blur: (e) => {
                        this.grimpan.saveSetting.blur = e.target?.checked;
                    },
                    invert: (e) => {
                        this.grimpan.saveSetting.invert = e.target?.checked;
                    },
                    grayscale: (e) => {
                        this.grimpan.saveSetting.grayscale = e.target?.checked;
                    },
                })
                    .build();
                btn.draw();
                return btn;
            }
        }
    }
    static getInstance(grimpan, dom) {
        if (!this.instance) {
            this.instance = new ChromeGrimpanMenu(grimpan, dom);
        }
        return this.instance;
    }
}
