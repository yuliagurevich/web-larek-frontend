import { IOrder, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

export type OrderResponse = {
    id: string,
    total: number
}

interface IWebLarekApi {
    getProducts: () => Promise<IProduct[]>;
    placeOrder: (order: IOrder) => Promise<OrderResponse>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
    cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit){
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => 
            data.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeOrder(order: IOrder): Promise<OrderResponse> {
        return this.post('/order', order).then((data: OrderResponse) => data)
    }
}