import AbstractGrimpan from './Factory/AbstractGrimpan.js';
import { IEGrimpanFactory } from './Factory/GrimpanFactory.js';
class IEGrimpan extends AbstractGrimpan {
    static instance;
    initialize() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IEGrimpan(document.querySelector('#canvas'), IEGrimpanFactory);
        }
        return this.instance;
    }
}
export default IEGrimpan;
