// Товары
export interface IProduct {
    id: string;
    title: string;
    image: string;
    description: string;
    category: string;
    price: number | null;
}

export type TProductId = IProduct['id'] ;

export type TProductListCardInfo = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

export type TProductPreviewCardInfo = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>;

export type TProductBasketCardInfo = { itemIndex: number } | Pick<IProduct, 'title' | 'price'>;

export interface IProductsData {
    items: IProduct[];
    getProductById(productId: TProductId): IProduct;
}

// Заказ
export interface IOrder {
    payment: 'online' | 'cash';
    address: string;
    email: string;
    phone: string;
    total: number;
    items: TProductId[];    
}

export type TPayment = IOrder['payment'];

export interface IOrderData {    
    addItem(id: TProductId, price: number): number;
    removeItem(id: TProductId, price: number): number;
    checkVlidity(): TOrderValidationError;
}

export type TOrderValidationError = Partial<Record<keyof IOrder, string>>;

