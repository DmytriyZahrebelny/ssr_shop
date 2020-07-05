export interface Product {
	_id: string;
	id: string;
	image: string;
	price: string;
	title: string;
	type: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProductData {
	image: string;
	price: string;
	title: string;
	type: string;
	description: string;
}
