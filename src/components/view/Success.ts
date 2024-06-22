import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../common/Component';

type TOrderSuccessInfo = {
	orderTotal: number;
};

export class Success extends Component<TOrderSuccessInfo> {
	protected _orderTotal: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
		this._orderTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			element
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			element
		);
		this.button.addEventListener('click', () => {
			events.emit('order:finished');
		});
	}

	set orderTotal(value: number) {
		this._orderTotal.textContent = `${value} синапсов`;
	}
}
