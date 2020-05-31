import express, { Request, Response } from 'express';
import Products from './products.interface';
import Controller from '../../interfaces/controller.interface';
import productModel from './products.model';

class ProductsController implements Controller {
	public path = '/products';
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/create-products`, this.createProducts);
	}

	async createProducts(req: Request, res: Response): Promise<void> {
		const productData: Products = await req.body;

		const createdProduct = await new productModel(productData);
		createdProduct.save().then((product) => {
			res.send(product);
		});
	}
}

export default ProductsController;
