import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";

type TFormStateInfo = {
    isValid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<TFormStateInfo> {
    protected submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected element: HTMLFormElement) {
        super(element);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', element);
        this._errors = ensureElement<HTMLElement>('.form__errors', element);
    }

    set isValid(value: boolean) {
        this.submitButton.disabled = !value;        
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(state: T & TFormStateInfo) {
        const {isValid, errors, ...inputs} = state;
        super.render({isValid, errors});
        Object.assign(this, inputs);
        return this.element;
    }
}