import { CircleSelectCommand, Command, EraserSelectCommand, PenSelectCommand, PipetteSelectCommand, PremiumCommandProxy, RectangleSelectCommand, SaveHistoryCommand, } from '../Commands/index.js';
import { Grimpan } from '../Factory/Grimpan.js';
const convertToHex = (color) => {
    if (color < 0)
        return 0;
    if (color > 255)
        return 255;
    const hex = color.toString(16); // 16진법으로 바꿈
    return `0${hex}`.slice(-2); // 2자리임을 고정 // 05 -> 05, 0ab -> ab
};
const rgbToHex = (r, g, b) => {
    return `#${convertToHex(r)}${convertToHex(g)}${convertToHex(b)}`;
};
/**
 * State 패턴을 활용한 예시
 */
export class Mode {
    grimpan;
    constructor(grimpan) {
        this.grimpan = grimpan;
    }
    // 모든 커맨드의 실행을 이 invoker 함수에서 통제하기 위해 따로 둠.
    invoke(command) {
        command.execute();
    }
}
export class PenMode extends Mode {
    constructor(grimpan) {
        super(grimpan);
        grimpan.menu.executeCommand(new PenSelectCommand(grimpan));
    }
    mousedown(e) {
        this.grimpan.active = true;
        this.grimpan.ctx.lineWidth = 1;
        this.grimpan.ctx.lineCap = 'round';
        this.grimpan.ctx.strokeStyle = this.grimpan.color;
        this.grimpan.ctx.globalCompositeOperation = 'source-over';
        this.grimpan.ctx.beginPath();
        this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
    }
    mousemove(e) {
        if (!this.grimpan.active)
            return;
        this.grimpan.ctx.lineTo(e.offsetX, e.offsetY);
        this.grimpan.ctx.stroke();
        this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
    }
    mouseup(e) {
        if (this.grimpan.active) {
            // history 저장
            this.invoke(new SaveHistoryCommand(this.grimpan));
        }
        this.grimpan.active = false;
    }
}
export class EraserMode extends Mode {
    constructor(grimpan) {
        super(grimpan);
        grimpan.menu.executeCommand(new EraserSelectCommand(grimpan));
    }
    mousedown(e) {
        this.grimpan.active = true;
        this.grimpan.ctx.lineWidth = 10;
        this.grimpan.ctx.lineCap = 'round';
        this.grimpan.ctx.strokeStyle = this.grimpan.color;
        this.grimpan.ctx.globalCompositeOperation = 'destination-out';
        this.grimpan.ctx.beginPath();
        this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
    }
    mousemove(e) {
        if (!this.grimpan.active)
            return;
        this.grimpan.ctx.lineTo(e.offsetX, e.offsetY);
        this.grimpan.ctx.stroke();
        this.grimpan.ctx.moveTo(e.offsetX, e.offsetY);
    }
    mouseup(e) {
        if (this.grimpan.active) {
            // history 저장
            this.invoke(new SaveHistoryCommand(this.grimpan));
        }
        this.grimpan.active = false;
    }
}
export class PipetteMode extends Mode {
    constructor(grimpan) {
        super(grimpan);
        grimpan.menu.executeCommand(new PipetteSelectCommand(grimpan));
    }
    mousedown(e) { }
    mousemove(e) {
        const { data } = this.grimpan.ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
        if (data[3] === 0) {
            // 투명도
            this.grimpan.changeColor('#ffffff');
        }
        else {
            this.grimpan.changeColor(rgbToHex(data[0], data[1], data[2]));
        }
    }
    mouseup(e) {
        this.grimpan.setMode('pen');
    }
}
export class RectangleMode extends Mode {
    constructor(grimpan) {
        super(grimpan);
        grimpan.menu.executeCommand(new PremiumCommandProxy(new RectangleSelectCommand(grimpan)));
    }
    mousedown(e) {
        this.grimpan.active = true;
    }
    mousemove(e) { }
    mouseup(e) {
        if (this.grimpan.active) {
            // history 저장
            this.invoke(new SaveHistoryCommand(this.grimpan));
        }
        this.grimpan.active = false;
    }
}
export class CircleMode extends Mode {
    constructor(grimpan) {
        super(grimpan);
        // 기존 코드를 수정하지 않고, proxy 패턴을 이용하여 프리미엄 유저만 사용하도록 접근제어를 할 수가 있음.
        grimpan.menu.executeCommand(new PremiumCommandProxy(new CircleSelectCommand(grimpan)));
    }
    mousedown(e) {
        this.grimpan.active = true;
    }
    mousemove(e) { }
    mouseup(e) {
        if (this.grimpan.active) {
            // history 저장
            this.invoke(new SaveHistoryCommand(this.grimpan));
        }
        this.grimpan.active = false;
    }
}
