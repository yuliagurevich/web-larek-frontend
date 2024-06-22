import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL, settings } from './utils/constants';
import { Product, ProductsData } from './components/model/ProductsData';
import { Page } from './components/view/Page';
import { BasketCard, CatalogCard, PreviewCard } from './components/view/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { OrderData } from './components/model/OrderData';
import { Basket } from './components/view/Basket';
import { IOrder, IProduct, TProductId } from './types';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';

const cardTemplete = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// API
const api = new WebLarekApi(CDN_URL, API_URL, settings);

// Брокер событий
const events = new EventEmitter();

// Модели данных
const productsList = new ProductsData();
const order = new OrderData();

// Компоненты
const pageElement = new Page(document.body, events);
const modalElement = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const basketElement = new Basket(cloneTemplate(basketTemplate), {
	handleOrderStart: () => {
		events.emit('order:start');
	},
});

// Реакция по клику на кнопку закрытия окна подтверждения заказа
events.on('order:finished', () => {
	modalElement.close();
});

// Реакция на клик по кнопке подтверждения заказа
events.on('order:place', () => {
	api
		.placeOrder({
			payment: order.payment,
			email: order.email,
			phone: order.phone,
			address: order.address,
			total: order.total,
			items: order.items,
		})
		.then((orderResponse) => {
			if (orderResponse) {
				const successElement = new Success(
					cloneTemplate(successTemplate),
					events
				);
				modalElement.render({
					content: successElement.render({
						orderTotal: orderResponse.total,
					}),
				});
				order.clearOrder();
				pageElement.basketCounter = order.items.length;
			} else {
				console.log('Something went really wrong');
			}
		});
});

// Реакция на подтверждение способа оплаты и адреса доставки:
// открытие формы контактов
events.on('order:proceed', () => {
	const contactsForm = new Contacts(cloneTemplate(contactsTemplate), {
		handleSubmitContactsButtonClick: (event: SubmitEvent) => {
			event.preventDefault();
			events.emit('order:place');
		},
		handleEmailInputChange: (event) => {
			const target = event.target as HTMLInputElement;
			order.email = target.value;
			const { email, phone } = order.checkVlidity();

			contactsForm.isValid = !email && !phone;
			contactsForm.errors = Object.values({ email, phone })
				.filter((i) => !!i)
				.join(' ');
		},
		handlePhoneInputChange: (event) => {
			const target = event.target as HTMLInputElement;
			order.phone = target.value;
			const { email, phone } = order.checkVlidity();
			contactsForm.isValid = !email && !phone;
			contactsForm.errors = Object.values({ email, phone })
				.filter((i) => !!i)
				.join(' ');
		},
	});
	modalElement.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			isValid: !order.checkVlidity().email && !order.checkVlidity().phone,
			errors: Object.values({
				email: order.checkVlidity().email,
				phone: order.checkVlidity().phone,
			})
				.filter((i) => !!i)
				.join(' '),
		}),
	});
});

// Реакция на клик по кнопке начала оформления заказа:
// открытие формы выбора способа платежа и адреса доставки
events.on('order:start', () => {
	const orderForm = new Order(cloneTemplate(orderTemplate), {
		handleOrderButtonClick: (event: SubmitEvent) => {
			event.preventDefault();
			events.emit('order:proceed');
		},
		handleAddressInputChange: (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			order.address = target.value;
			const { payment, address } = order.checkVlidity();
			orderForm.isValid = !payment && !address;
			orderForm.errors = Object.values({ payment, address })
				.filter((i) => !!i)
				.join(' ');
		},
		handleCardButtonClick: () => {
			order.payment = 'online';
			orderForm.payment = 'online';
			const { payment, address } = order.checkVlidity();
			orderForm.isValid = !payment && !address;
			orderForm.errors = Object.values({ payment, address })
				.filter((i) => !!i)
				.join(' ');
		},
		handleCashButtonClick: () => {
			order.payment = 'cash';
			orderForm.payment = 'cash';
			const { payment, address } = order.checkVlidity();
			orderForm.isValid = !payment && !address;
			orderForm.errors = Object.values({ payment, address })
				.filter((i) => !!i)
				.join(' ');
		},
	});

	modalElement.render({
		content: orderForm.render({
			payment: order.payment,
			address: order.address,
			isValid: !order.checkVlidity().payment && !order.checkVlidity().address,
			errors: Object.values({
				payment: order.checkVlidity().payment,
				address: order.checkVlidity().address,
			})
				.filter((i) => !!i)
				.join(' '),
		}),
	});
});

// Реакция на клик по кнопке удаления товара из корзины
events.on('item:remove', (product: IProduct) => {
	pageElement.basketCounter = order.removeItem(product.id, product.price);
	basketElement.render({
		basketPrice: order.total,
		basketList: Array.from(order.items).map((id: TProductId, index: number) => {
			const product = productsList.getProductById(id);
			const cardElement = new BasketCard(cloneTemplate(basketCardTemplate), {
				handleItemRemove: () => {
					events.emit('item:remove', product);
				},
			});
			return cardElement.render({
				itemIndex: index + 1,
				title: product.title,
				price: product.price,
			});
		}),
		isValid: !order.checkVlidity().items,
		error: order.checkVlidity().items,
	});
});

// Реакция на клик по кнопке корзины
events.on('basket:open', () => {
	modalElement.render({
		content: basketElement.render({
			basketPrice: order.total,
			basketList: Array.from(order.items).map(
				(id: TProductId, index: number) => {
					const product = productsList.getProductById(id);
					const cardElement = new BasketCard(
						cloneTemplate(basketCardTemplate),
						{
							handleItemRemove: () => {
								events.emit('item:remove', product);
							},
						}
					);
					return cardElement.render({
						itemIndex: index + 1,
						title: product.title,
						price: product.price,
					});
				}
			),
			isValid: !order.checkVlidity().items,
			error: order.checkVlidity().items,
		}),
	});
});

// Реакция на клик по карточке товара
events.on('card:select', (item: Product) => {
	const cardElement = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
		handleAddToBasket: () => {
			pageElement.basketCounter = order.addItem(item.id, item.price);
			cardElement.toggleAction();
		},
		handleRemoveFromBasket: () => {
			pageElement.basketCounter = order.removeItem(item.id, item.price);
			cardElement.toggleAction();
		},
		cardAction: order.items.includes(item.id) ? 'remove' : 'add',
	});

	modalElement.render({
		content: cardElement.render({
			image: item.image,
			category: item.category,
			title: item.title,
			description: item.description,
			price: item.price,
		}),
	});
});

// Реакция на открытие модального окна:
// фиксирование позиция обертки страницы
events.on('modal:open', () => {
	pageElement.locked = true;
});

// Реакция на закрытие модального окна
events.on('modal:closed', () => {
	pageElement.locked = false;
});

// Загружаем каталог продуктов с сервера - можно сразу отрисовывать список, без генерации события
api
	.getProducts()
	.then((data) => {
		productsList.productList = data;
		pageElement.catalog = productsList.productList.map((item) => {
			const cardElement = new CatalogCard(cloneTemplate(cardTemplete), {
				onClick: () => events.emit('card:select', item),
			});
			return cardElement.render({
				category: item.category,
				title: item.title,
				image: item.image,
				price: item.price,
			});
		});
	})
	.catch((error) => {
		console.error('Get products error:', error);
	});
