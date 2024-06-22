import {
	TProductBasketCardInfo,
	TProductListCardInfo,
	TProductPreviewCardInfo,
} from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../common/Component';

interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export class CatalogCard extends Component<TProductListCardInfo> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(element: HTMLElement, action: ICardAction) {
		super(element);
		this._category = ensureElement<HTMLElement>('.card__category', element);
		this._title = ensureElement<HTMLElement>('.card__title', element);
		this._image = ensureElement<HTMLImageElement>('.card__image', element);
		this._price = ensureElement<HTMLElement>('.card__price', element);

		this.element.addEventListener('click', action.onClick);
	}

	set category(value: string) {
		this._category.textContent = value;
		switch (value) {
			case 'другое':
				this._category.classList.replace(
					'card__category_soft',
					'card__category_other'
				);
				break;
			case 'софт-скил':
				this._category.classList.toggle('card__category_soft', true);
				break;
			case 'дополнительное':
				this._category.classList.replace(
					'card__category_soft',
					'card__category_additional'
				);
				break;
			case 'кнопка':
				this._category.classList.replace(
					'card__category_soft',
					'card__category_button'
				);
				break;
			case 'хард-скил':
				this._category.classList.replace(
					'card__category_soft',
					'card__category_hard'
				);
				break;
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set image(value: string) {
		this._image.src = value;
	}

	set price(value: number | null) {
		if (value === null) {
			this._price.textContent = '0 синапсов';
		} else {
			this._price.textContent = `${value} синапсов`;
		}
	}
}

interface IPreviewCardAction {
	handleAddToBasket: () => void;
	handleRemoveFromBasket: () => void;
	cardAction: 'add' | 'remove';
}

export class PreviewCard extends Component<TProductPreviewCardInfo> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLButtonElement;
	protected cardAction: 'add' | 'remove';
	private cardActionText: 'Добавить' | 'Убрать';

	constructor(element: HTMLElement, protected actions: IPreviewCardAction) {
		super(element);
		this._image = ensureElement<HTMLImageElement>('.card__image', element);
		this._category = ensureElement<HTMLElement>('.card__category', element);
		this._title = ensureElement<HTMLElement>('.card__title', element);
		this._description = ensureElement<HTMLElement>('.card__text', element);
		this._price = ensureElement<HTMLElement>('.card__price', element);
		this.button = ensureElement<HTMLButtonElement>('.button', element);

		this.cardAction = actions.cardAction;

		this.actions.cardAction === 'add'
			? (this.cardActionText = 'Добавить')
			: (this.cardActionText = 'Убрать');

		if (this.cardAction === 'add') {
			this.button.textContent = this.cardActionText;
			this.button.addEventListener('click', actions.handleAddToBasket);
		} else {
			this.button.textContent = this.cardActionText;
			this.button.addEventListener('click', actions.handleRemoveFromBasket);
		}
	}

	set image(value: string) {
		this._image.src = value;
	}

	set category(value: string) {
		this._category.textContent = value;
		switch (value) {
			case 'другое':
				this._category.classList.toggle('card__category_other', true);
				break;
			case 'софт-скил':
				this._category.classList.replace(
					'card__category_other',
					'card__category_soft'
				);
				break;
			case 'дополнительное':
				this._category.classList.replace(
					'card__category_other',
					'card__category_additional'
				);
				break;
			case 'кнопка':
				this._category.classList.replace(
					'card__category_other',
					'card__category_button'
				);
				break;
			case 'хард-скил':
				this._category.classList.replace(
					'card__category_other',
					'card__category_hard'
				);
				break;
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set price(value: number) {
		if (value === null) {
			this._price.textContent = '0 синапсов';
            this.button.disabled = true;
		} else {
			this._price.textContent = `${value} синапсов`;
		}
	}	

	toggleAction() {
		if (this.cardAction === 'add') {
			this.cardAction = 'remove';
			this.cardActionText = 'Убрать';
			this.button.textContent = this.cardActionText;
			this.button.removeEventListener('click', this.actions.handleAddToBasket);
			this.button.addEventListener(
				'click',
				this.actions.handleRemoveFromBasket
			);
		} else {
			this.cardAction = 'add';
			this.cardActionText = 'Добавить';
			this.button.textContent = this.cardActionText;
			this.button.removeEventListener(
				'click',
				this.actions.handleRemoveFromBasket
			);
			this.button.addEventListener('click', this.actions.handleAddToBasket);
		}
	}
}

interface IBasketCardAction {
	handleItemRemove: (event: MouseEvent) => void;
}

export class BasketCard extends Component<TProductBasketCardInfo> {
	protected _itemIndex: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(element: HTMLElement, protected actions: IBasketCardAction) {
		super(element);
		this._itemIndex = ensureElement<HTMLElement>(
			'.basket__item-index',
			element
		);
		this._title = ensureElement<HTMLElement>('.card__title', element);
		this._price = ensureElement<HTMLElement>('.card__price', element);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			element
		);

		this.button.addEventListener('click', actions.handleItemRemove.bind(this));
	}

	set itemIndex(value: number) {
		this._itemIndex.textContent = value.toString();
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		if (value === null) {
			this._price.textContent = '0 синапсов';
		} else {
			this._price.textContent = `${value} синапсов`;
		}
	}
}
