import { IProduct, TProductId } from '../../types';

export class ProductsData {
	protected _productList: IProduct[];

	get productList() {
		return this._productList;
	}

	set productList(items: IProduct[]) {
		this._productList = items;
	}

	getProductById(id: TProductId): IProduct {
		return this._productList.find((item: IProduct) => item.id === id);
	}
}
