# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
interface IProduct {
    id: string;
    title: string;
    image: string;
    description: string;
    category: string;
    price: number | null;
}
```
Данные товара, используемые для карточки в каталоге

```
type TProductListCardInfo = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;
```

Данные товара, используемые для карточки просмотра подробной информации о товаре

```
type TProductPreviewCardInfo = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>;
```

Данные товара, используемые для отображения информации о товаре в корзине пользователя

```
type TProductBasketCardInfo = Pick<IProduct, 'title' | 'price'>;
```

Интерфейс модели данных (список товаров)

```
interface IListModel<IProduct> {
    items: IProduct[];    
}
```

Заказ
Интерфейс модели данных
```
interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}
```

```
interface IOrderData {    
    addItem(id: TProductId, price: number): number;
    removeItem(id: TProductId, price: number): number;
    checkVlidity(): TOrderValidationError;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления (View), отвечает за отображение данных на странице, 
- слой данных (Model), отвечает за хранение и изменение данных
- презентер (Presenter), отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет `GET` запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс данных о товарах ProductsData
Класс отвечает за хранение данных о товарах.\
В полях класса хранятся следующие данные:
- `_productList: Product[]` - массив объектов товаров
Так же класс предоставляет набор методов для взаимодействия с этими данными:
- `getProductById(id: TProductId): IProduct` - ищет товар по его идентификатору

#### Класс данных о заказе OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
В полях класса хранятся следующие данные:
- `_items: TProductId[]` - массив идентификаторов товаров, добавленных в корзину
- `_total: number` - общая сумма заказа
- `_payment: TPayment` - выбранный тип оплаты заказа
- `_address: string` - адрес доставки заказа
- `_email: string` - адрес электронной почты покупателя
- `_phone: string` - телефон покупателя\
Так же класс предоставляет набор методов для взаимодействия с этими данными:
- `addItem(id: TProductId, price: number): number` - добавляет товар в заказ, возвращает текущее количество товаров в корзине
- `removeItem(id: TProductId, price: number): number` - удаляет товар из заказа, возвращает текущее количество товаров в корзине
- `checkVlidity()` - валидирует поля `_items`, `_payment`, `_address`, `_email`, `_phone`

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод `render` для отображения данных в компоненте. В конструктор принимается элемент разметки, являющийся текущим компонентом. Содержит метод `render`, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает текущий компонент.

#### Класс Page
Отвечает за отображение списка товаров и иконку корзины покупателя со счетчиком товаров.

Поля класса:
- `_catalog: HTMLElement` - элемент-контейнер для каталога товаров
- `wrapper: HTMLElement` - элемент-обертка для блокировки прокрутки страницы при открытии модального окна
- `basketButton: HTMLElement` - кнопка открытия корзины в модальном окне
- `_basketCounter: HTMLElement` - элемент счетчика товаров в корзине

Конструктор принимает элемент страницы `body` и экземпляр брокера событий. На кнопку открытия модального окна корзины устанавливается слушатель

#### Класс CatalogCard
Отвечает за отображение карточки товара в каталоге.\
Устанавливает значения следующих элементов:
- `_category: HTMLElement` - элемент категории товара
- `_title: HTMLElement` - элемент заголовка карточки с названием товара
- `_image: HTMLImageElement` - элемент с изображением товара
- `_price: HTMLElement` - элемент с данными о цене товара

В конструктор передается элемент карточки и объект с обработчиком события. По клику на карточку открывается модальное окно с информацией о товаре.

#### Класс Modal
Реализует модальное окно. Предназначен для отображения таких компонентов как `PreviewCard`, `Basket`, `Order`, `Contacts`, `Success`.

Поля класса:
- `_content: HTMLElement` - элемент содежимого модального окна
- `closeButton: HTMLButtonElement` - элемент кнопки закрытия модального окна
- `events: IEvents` - экзепляр брокера событий

Конструктор принимает элемент модального окна и экземпляр класса `EventEmitter` для возможности инициации событий. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.

Методы класса:
- `open()` - открывает модальное окно и запускает событие, блокирующее прокрутку страницы
- `close()` - закрывает модальное окно и запускает событие, разблокирующее прокрутку страницы
- `render(data: TModalContent): HTMLElement` - переписывает метод родительского элемента, добавляя инициацию события открытия модального окна

#### Класс PreviewCard
Отвечает за отображение подробной информации о товаре с возможностью добавить товар в корзину.\
Устанавливает значения следующих элементов:
- `_image: HTMLImageElement` - элемент с изображением товара
- `_category: HTMLElement` - элемент с текстом категории товара
- `_title: HTMLElement` - заголовок карточки с названием товара
- `_description: HTMLElement` - элемент с описанием товара
- `_price: HTMLElement` - элемент с текстом о стоимости товара

В конструктор передается элемент карточки и объект с обработчиками событий. Соответствующий обработчик события устанавливается на кнопку добавления/удаления товара в зависимости от того, есть ли уже данный товар в корзине. Текст кнопки также меняется на сответстующий действию. В случае, если у товара не установлена цена, кнопка добавления товара блокируется.

#### Класс Basket
Отвечает за отображение списка выбранных товаров и общей стоимости заказа.

Устанавливает значения следующих элементов:
- `_basketList: HTMLElement` - элемент-контейнер списка товаров
- `_basketPrice: HTMLElement` - элемент с текстом об общей стоимости товаров в корзине

В конструктор передается элемент корзины и объект с обработчиком события. Обработчик устанавливается на кнопку начала заказа. Если в корзине нет товаров, кнопка заблокирована, в контейнер списка товаров передается текст сообщения об ошибке.

#### Класс BasketCard
Отвечает за отображение краткой информации о товаре в списке товаров корзины.

Устанавливает значения следующих элементов:
- `_itemIndex: HTMLElement` - порядковый номер товара в корзине
- `_title: HTMLElement` - заголовок карточки с названием товара
- `_price: HTMLElement` - элемент с текстом о стоимости товара

В конструктор передается элемент карточки и объект с обработчиком события клика по кнопке удаления товара из корзины.

#### Базовый класс Form
Класс расширяет класс `Component`, является родителем компонентов, содержащих формы (`Order`, `Contacts`). Является дженериком. В дженерик принимает тип данных из форм. В конструктор принимается элемент разметки, являющийся текущим компонентом формы. Расширяет метод `render` родительского класса. Метод `render` отвечает за отображение ошибок валидации полей ввода, полученных в параметре, и данных в полях формы через их сеттеры. Возвращает текущий компонент формы.

Устанавливает значения следующих элементов форм:
- `submitButton: HTMLButtonElement` - кнопка подтверждения данных формы для обработки
- `_errors: HTMLElement` -  элемент для отображения текста ошибки валидации формы

Блокирует кнопку подтверждения данных формы для отправки при наличии ошибок валидации полей формы.

#### Класс Order
Отвечает за отображение первой из двух форм заказа. Класс расширяет базовый класс `Form`. 

Устанавливает значения следующих элементов:
- `cardButton: HTMLButtonElement` - кнопка для установки способа оплаты онлайн
- `cashButton: HTMLButtonElement` - кнопка для установки способа оплаты при получении заказа
- `input: HTMLInputElement` - поле ввода адреса доставки заказа

В конструктор передается элемент формы и объект с обработчиками событий. Обработчики устанавливаются на кнопки продолжения заказа, выбора способа оплаты, поле ввода адреса доставки.

#### Класс Contacts
Отвечает за отображение второй из двух форм заказа. Класс расширяет базовый класс `Form`. 

Устанавливает значения следующих элементов:
- `emailInput: HTMLInputElement` - поле ввода адреса электронной почты
- `phoneInput: HTMLInputElement` - поле ввода телефона покупателя

В конструктор передается элемент формы и объект с обработчиками событий. Обработчики устанавливаются на кнопку продолжения заказа, поля ввода адреса электронной почты и телефона.

#### Класс Success
Отвечает за отображение блока подтверждения заказа.

Устанавливает значения следующих элементов:
- `_orderTotal: HTMLElement` - элемент для отображения общей стоимости заказа
- `events: IEvents` - экзепляр брокера событий

В конструктор передается элемент блока подтверждения заказа и экземпляр брокера событий `EventEmitter`. На кнопку устанавливается слушатель.

### Слой коммуникации

#### Класс WebLarekApi
Расширяет класс `Api`. Принимает в конструктор строки с адресами сервера сервиса и удаленного хранилища данных для изображений. Предоставляет методы реализующие взаимодействие с бэкендом сервиса web-larek:
- `getProducts(): Promise<IProduct[]>` - получает список доступных товаров, дополняет строку ссылки на картинку данными об адресе удаленного хранилища
- `placeOrder(order: IOrder): Promise<OrderResponse>` - отправляет данные о заказе

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Модели данных событий не генерируют.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modal:open` - открытие модального окна 
- `modal:closed` -  закрытие модального окна
- `card:select` -  выбор карточки товара для отображения в модальном окне
- `basket:render` -  рендер корзины при открытии и ререндер при изменении списка товаров
- `items:change` -  изменение списка товаров в корзине (при добавлении и удалении товара)
- `order:start` -  начало оформления заказа в корзине
- `order:proceed` -  подтверждение заполнения первой формы заказа (способ оплаты и адрес доставки товара)
- `order:place` -  подтверждение заполнения второй формы заказа (адрес электронной почты и телефон), отправка данных заказа на сервер
- `order:finished` -  закрытие формы подтверждения заказа