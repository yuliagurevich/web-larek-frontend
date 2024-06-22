import { ensureElement } from "../../utils/utils";
import { Component } from "../common/Component";

export type TBasketInfo = {    
    basketList: HTMLElement[],
    basketPrice: number,
    isValid: boolean,
    error: string
}

interface IBasketAction {
    handleOrderStart: (event: MouseEvent) => void;
}

export class Basket extends Component<TBasketInfo> {
    protected _basketList: HTMLElement;
    protected _basketPrice: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(element: HTMLElement, protected actions: IBasketAction) {
        super(element);
        this._basketList = ensureElement<HTMLElement>('.basket__list', element);
        this._basketPrice = ensureElement<HTMLElement>('.basket__price', element);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', element);

        this.button.addEventListener('click', actions.handleOrderStart.bind(this));
    }
    
    set basketPrice(value: number) {
        this._basketPrice.textContent = `${value.toString()} синапсов`;
    }
    
    set basketList(items: HTMLElement[]) {
        this._basketList.replaceChildren(...items);
    }
    
    set isValid(value: boolean) {
        this.button.disabled = !value;        
    }

    set error(value: string) {
        if(value) {
            this._basketList.replaceChildren(value);
        }
    }
}
