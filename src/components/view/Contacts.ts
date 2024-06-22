import { Form } from "../common/Form";

type TContactsInfo = {
    email: string;
    phone: string;
}

interface IContactsActions {
    handleSubmitContactsButtonClick: (event: SubmitEvent) => void;
    handleEmailInputChange: (event: InputEvent) => void;
    handlePhoneInputChange: (event: InputEvent) => void;
}

export class Contacts extends Form<TContactsInfo> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(form: HTMLFormElement, protected actions: IContactsActions) {
        super(form);
        this.emailInput = form.elements.namedItem('email') as HTMLInputElement;
        this.phoneInput = form.elements.namedItem('phone') as HTMLInputElement;

        this.emailInput.addEventListener('input', actions.handleEmailInputChange.bind(this));
        this.phoneInput.addEventListener('input', actions.handlePhoneInputChange.bind(this));
        
        this.submitButton.addEventListener('click', actions.handleSubmitContactsButtonClick.bind(this));
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}