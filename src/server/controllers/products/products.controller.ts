import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Product, CreateProductData } from './products.interface';
import Controller from '../../interfaces/controller.interface';
import productModel from './products.model';

class ProductsController implements Controller {
	public path = '/products';
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(this.path, this.getAllProducts);
		this.router.get(`${this.path}/:id`, this.getProductById);
		this.router.post(this.path, this.createProducts);
		this.router.patch(`${this.path}/:id`, this.modifyProduct);
		this.router.delete(`${this.path}/:id`, this.deleteProduct);
	}

	async getProductById(req: express.Request, res: express.Response): Promise<void> {
		const id: string = req.params.id;
		const product = await productModel.find({ id });

		res.send(product);
	}

	async getAllProducts(req: Request, res: Response): Promise<void> {
		const products: Product[] = await productModel.find();

		res.send(products);
	}

	async createProducts(req: Request, res: Response): Promise<void> {
		const productData: CreateProductData = await req.body;
		const id: string = uuid();

		const createdProduct = await new productModel({ ...productData, id });
		createdProduct.save().then((product: Product) => {
			res.send(product);
		});
	}

	async modifyProduct(req: Request, res: Response): Promise<void> {
		const id: string = req.params.id;
		const productData: any = req.body;

		const updateProduct = await productModel.findOneAndUpdate(
			{ id },
			{
				$set: { ...productData },
			},
			{ new: true }
		);

		res.send(updateProduct);
	}

	async deleteProduct(req: Request, res: Response): Promise<void> {
		const id = req.params.id;

		await productModel.find({ id }).remove();

		res.send(true);
	}
}

export default ProductsController;
