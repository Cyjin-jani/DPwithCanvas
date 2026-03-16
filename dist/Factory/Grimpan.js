import { BackCommand, Command, ForwardCommand, SaveHistoryCommand } from '../Commands/index.js';
import { BlurFilter, DefaultFilter, GrayscaleFilter, InvertFilter } from '../filters/index.js';
import { CircleMode, EraserMode, PenMode, PipetteMode, RectangleMode, } from '../modes/index.js';
import { SubscriptionManager } from '../Observer.js';
import { ChromeGrimpanFactory, IEGrimpanFactory, } from './GrimpanFactory.js';
class Grimpan {
    canvas;
    ctx;
    history;
    menu;
    mode;
    color;
    active; // 마우스 눌렀는지 유무.
    saveStrategy;
    saveSetting = {
        blur: false,
        invert: false,
        grayscale: false,
    };
    constructor(canvas, factory) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.color = '#000';
        this.active = false;
        this.setSaveStrategy('png');
        SubscriptionManager.getInstance().addEvent('saveComplete');
    }
    // history 저장을 위한 메멘토 패턴
    // 반드시, 상태를 가지고 있는 class 안에서 만들어야 함.
    // 가끔 snapshot으로 저장해야 할 상태들이 private인 경우가 있을 수 있음.
    // 이를 대비하기 위해 같은 class 내부에서 데이터를 이렇게 만들어서 처리하는 것.
    // 메멘토 패턴의 단점은, 객체 상태 전체를 저장하는 거라서, 히스토리가 많이 쌓이면 메모리 비용이 많이 들 수 있음. (렘이 늘어남)
    // 게다가 브라우저 환경에서는 하나의 페이지에서 사용될 수 있는 메모리 양이 한정되어있음
    // 따라서 history는 100개까지만 쌓이게 한다던지 하는 식으로 제한을 두는 것이 좋음.
    makeSnapshot() {
        const snapshot = {
            color: this.color,
            mode: this.mode,
            data: this.canvas.toDataURL('image/png'),
        };
        return Object.freeze(snapshot); // js에서는 private이 사라짐. 그래서 객체를 얼리는 형태로써 불변성을 지키려고 함
        // 객체 수정을 못하게 하는 다른 방법이 있을까?
        // - Object.preventExtensions() : 새로운 거 추가하는 것만 막음 (가장 제약을 덜 줌)
        // - Object.seal() : 객체에 추가 또는 삭제는 막음. 대신 수정하는 건 좀 허용을 함.. (기존 값 수정 가능)
        // freeze()가 수정까지 못하게 막아주는 것.
    }
    setSaveStrategy(imageType) {
        // 각 case 별로 일종의 알고리즘이 필요. 알고리즘을 전략이라고 부를 수도 있음.
        // 그래서 각 전략 별로 만드는 것이 Strategy pattern.
        // 원래는 객체로 만들어서 관리하지만, 아래와 같이 간단한 경우엔 람다 함수로 처리할 수도 있음.
        // 자기 스스로 상태를 바꿀 수 있는 건 state 패턴.
        // 예를 들어 grimpan.setStrategy('something') 이런 식으로 상태를 스스로 setting
        // saveStrategy는 어떤 grimpan이라든지 의존성을 받아서 처리할 수가 없음.
        // 결론적으로 부모에 대한 참조를 가지고 있지 않아야 전략(Strategy) 패턴이라고 볼 수 있음.
        switch (imageType) {
            case 'png':
                this.saveStrategy = () => {
                    // data 준비
                    let imageData = this.ctx.getImageData(0, 0, 300, 300);
                    const offscreenCanvas = new OffscreenCanvas(300, 300);
                    const offscreenContext = offscreenCanvas.getContext('2d');
                    offscreenContext.putImageData(imageData, 0, 0);
                    // 책임 연쇄 패턴으로 filter를 적용.
                    const df = new DefaultFilter();
                    let filter = df;
                    if (this.saveSetting.blur) {
                        const bf = new BlurFilter();
                        filter = filter.setNext(bf);
                    }
                    if (this.saveSetting.grayscale) {
                        const gf = new GrayscaleFilter();
                        filter = filter.setNext(gf);
                    }
                    if (this.saveSetting.invert) {
                        const ivf = new InvertFilter();
                        filter = filter.setNext(ivf);
                    }
                    // 필더 적용 완료 시 이미지 다운로드 처리.
                    // 반드시 책임 연쇄 패턴에선 첫 번째 handle을 실행해야 함
                    df.handle(offscreenCanvas).then(() => {
                        const a = document.createElement('a');
                        a.download = 'canvas.png';
                        offscreenCanvas.convertToBlob().then((blob) => {
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                const dataURL = reader.result;
                                let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
                                a.href = url;
                                a.click();
                                // 저장 완료에 대한 알림을 전달하기 위해 옵저버 패턴을 사용.
                                // 누가 구독하고 있는지는 모르겠지만, 구독하고 있는 모두에게 알림을 주겠다는 것.
                                SubscriptionManager.getInstance().publish('saveComplete');
                            });
                            reader.readAsDataURL(blob);
                        });
                    });
                };
                break;
            case 'jpg':
                this.saveStrategy = () => {
                    const a = document.createElement('a');
                    a.download = 'canvas.jpg';
                    a.href = this.canvas.toDataURL('image/jpeg');
                    a.click();
                };
                break;
            case 'webp':
                this.saveStrategy = () => {
                    const a = document.createElement('a');
                    a.download = 'canvas.webp';
                    a.href = this.canvas.toDataURL('image/webp');
                    a.click();
                };
                break;
            case 'avif':
                this.saveStrategy = () => { };
                break;
            case 'gif':
                this.saveStrategy = () => { };
                break;
            case 'pdf':
                this.saveStrategy = () => { };
                break;
        }
    }
    setMode(mode) {
        console.log(mode);
        switch (mode) {
            case 'pen':
                this.mode = new PenMode(this);
                break;
            case 'eraser':
                this.mode = new EraserMode(this);
                break;
            case 'pipette':
                this.mode = new PipetteMode(this);
                break;
            case 'rectangle':
                this.mode = new RectangleMode(this);
                break;
            case 'circle':
                this.mode = new CircleMode(this);
                break;
        }
    }
    invoke(command) {
        command.execute();
    }
    setColor(color) {
        this.color = color;
    }
    changeColor(color) {
        this.setColor(color);
        if (this.menu.colorBtn) {
            this.menu.colorBtn.value = color;
        }
    }
    // 필요없어졌지만 남겨둠
    resetState() {
        this.color = '#fff';
        this.mode = new PenMode(this);
        this.ctx.clearRect(0, 0, 300, 300);
    }
    restore(history) {
        const img = new Image();
        img.addEventListener('load', () => {
            this.ctx.clearRect(0, 0, 300, 300);
            this.ctx.drawImage(img, 0, 0, 300, 300);
        });
        img.src = history.data;
    }
    static getInstance() { }
}
class ChromeGrimpan extends Grimpan {
    // 다른 곳에서 new ChromeGrimpan(document.querySelector('#canvas'))등 별도 인스턴스를 만들어 사용하지 못하도록 하기 위해 private으로 처리함
    static instance;
    menu;
    history;
    constructor(canvas, factory) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('canvas 엘레먼트를 넣어주세요.');
        }
        super(canvas, factory);
        this.menu = factory.createGrimpanMenu(this, document.querySelector('#menu'));
        this.history = factory.createGrimpanHistory(this);
    }
    // 이 initialize도 사실 퍼사드 패턴임.
    // 이 함수 내부는 복잡한 구조를 띄고 있으나, 실제 사용되는 index.ts를 보면 아주 단순하게 사용함.
    // 어떤 함수 내부에서 여러 함수를 호출하여 사용하고 있으면 그거시 곧 퍼사드 패턴..
    // 단점은, 단일책임 원칙을 위반할 가능성이 높아짐.
    /**
     예시: grimpan.initialize({
            menu: ['back', 'forward', 'color', 'pipette', 'pen', 'circle', 'rectangle', 'eraser', 'save'],
          });
     */
    initialize(option) {
        this.menu.initialize(option.menu);
        this.history.initialize();
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
                this.menu.executeCommand(new ForwardCommand(this.history));
                return;
            }
            if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
                this.menu.executeCommand(new BackCommand(this.history));
                return;
            }
        });
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    }
    onMouseDown(e) {
        /**
         * State 패턴 활용의 예시
         * 두개 이상의 함수 내에서 동일한 if-else문 또는 switch-case 패턴이 반복되는 경우 사용할 수 있음.
         */
        this.mode.mousedown(e);
        // State 패턴이 없으면 여기서 switch case를 사용해야 함
        // switch (this.mode) {
        //   case 'pen':
        //     break;
        //   case 'eraser':
        //     break;
        //   case 'pipette':
        //     break;
        //   ...등등 내부 로직까지 포함. 이 switch case가 onMouseMove, onMouseUp에서도 동일하게 사용됨.
        // }
    }
    onMouseMove(e) {
        this.mode.mousemove(e);
    }
    onMouseUp(e) {
        this.mode.mouseup(e);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ChromeGrimpan(document.querySelector('#canvas'), ChromeGrimpanFactory);
        }
        return this.instance;
    }
}
class IEGrimpan extends Grimpan {
    static instance;
    initialize() { }
    onMouseDown() { }
    onMouseMove() { }
    onMouseUp() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
        }
        return this.instance;
    }
}
export { Grimpan, IEGrimpan, ChromeGrimpan };
