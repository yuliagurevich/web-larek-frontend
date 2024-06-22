import { TPayment } from "../../types";
import { Form } from "../common/Form";

type TOrderInfo = {
    payment: TPayment;
    address: string;    
}

interface IOrderActions {
    handleOrderButtonClick: (event: SubmitEvent) => void;
    handleCardButtonClick: (event: MouseEvent) => void;
    handleCashButtonClick: (event: MouseEvent) => void;
    handleAddressInputChange: (event: InputEvent) => void;
}

export class Order extends Form<TOrderInfo> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected input: HTMLInputElement;    
    
    constructor(form: HTMLFormElement, protected actions: IOrderActions) { 
        super(form);       
        this.cardButton = form.elements.namedItem('card') as HTMLButtonElement;
        this.cashButton = form.elements.namedItem('cash') as HTMLButtonElement;
        this.input = form.elements.namedItem('address') as HTMLInputElement;

        this.cardButton.addEventListener('click', actions.handleCardButtonClick.bind(this));
        this.cashButton.addEventListener('click', actions.handleCashButtonClick.bind(this));

        form.addEventListener('submit', actions.handleOrderButtonClick.bind(this));
        this.input.addEventListener('input', actions.handleAddressInputChange.bind(this));
    }

    set payment(value: TPayment) {
        switch(value) {
            case 'online':
                this.cardButton.classList.add('button_alt-active');
                this.cashButton.classList.remove('button_alt-active');
                break;
            case 'cash':
                this.cashButton.classList.add('button_alt-active');
                this.cardButton.classList.remove('button_alt-active');
                break;
        }
    }

    set address(value: string) {
        this.input.value = value;
    }
}