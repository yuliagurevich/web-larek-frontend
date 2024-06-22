import { IProduct, TProductId } from '../../types';

export class Product implements IProduct {
	id: string;
	title: string;
	image: string;
	description: string;
	category: string;
	price: number | null;

	constructor(data: IProduct) {
		this.id = data.id;
		this.title = data.title;
		this.image = data.image;
		this.description = data.description;
		this.category = data.category;
		this.price = data.price;
	}
}

export class ProductsData {
	protected _productList: Product[];

	get productList() {
		return this._productList;
	}

    set productList(items: Product[]) {
        this._productList = items;
    }

	getProductById(id: TProductId): IProduct {
		return this._productList.find((item: IProduct) => item.id === id);
	}
}
