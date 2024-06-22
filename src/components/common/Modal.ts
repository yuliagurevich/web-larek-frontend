import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

type TModalContent = {
    content: HTMLElement;
}

export class Modal extends Component<TModalContent> {
    protected _content: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(element: HTMLElement, protected events: IEvents) {
        super(element);

        this._content = ensureElement<HTMLElement>('.modal__content', element);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', element);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.element.addEventListener('mousedown', (event) => {
            if(event.target === event.currentTarget) {
                this.close();
            }
        });
        this.handleEscKeyUp = this.handleEscKeyUp.bind(this);
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.element.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscKeyUp);
        this.events.emit('modal:open');
    }

    close() {
        this.element.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscKeyUp);
        this.events.emit('modal:closed');
    }

    private handleEscKeyUp(event: KeyboardEvent) {
        if(event.key === 'Escape') {
            this.close();
        }
    }

    render(data: TModalContent): HTMLElement {
        super.render(data);
        this.open();
        return this.element;
    }
}