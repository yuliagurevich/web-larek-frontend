import { IOrder, IOrderData, TPayment, TProductId, TOrderValidationError } from "../../types";

export class OrderData implements IOrder, IOrderData {
    protected _items: TProductId[] = [];
    protected _total: number = 0;
    protected _payment: TPayment = 'online';
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    protected validationErrors: TOrderValidationError = {};

    get items() {
        return this._items;
    }

    get total() {
        return this._total;
    }

    get payment() {
        return this._payment;
    }

    set payment(value: TPayment) {
        this._payment = value;
    }

    get address() {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get email() {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get phone() {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
    }

    addItem(id: TProductId, price: number): number {
        this._items.push(id);
        this._total += price;
        return this._items.length;
    }    

    removeItem(id: TProductId, price: number): number {
        this._items = this._items.filter((value) => value !== id);
        this._total -= price;
        return this._items.length;
    }

    checkVlidity() {
        const errors: typeof this.validationErrors = {};

        if(this._items.length <= 0) {
            errors.items = 'Добавьте товары в корзину.';
        }
        if(!this._payment) {
            errors.payment = 'Укажите способ платежа.';
        }
        if(!this._address) {
            errors.address = 'Укажите адрес доставки.';
        }        
        if(!this._email) {
            errors.email = 'Укажите адрес электронной почты.';
        }
        if(!this._phone) {
            errors.phone = 'Укажите телефон.';
        }

        this.validationErrors = errors;
        return this.validationErrors;
    }

    clearOrder() {
        this._items = [];
        this._total = 0;
        this._payment = 'online';
        this._address = '';
        this._email = '';
        this._phone = '';
    }
}