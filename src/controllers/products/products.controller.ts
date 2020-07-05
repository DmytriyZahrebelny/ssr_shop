import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { Product, CreateProductData } from './products.interface';
import Controller from '../../interfaces/controller.interface';
import productModel from './products.model';
import ProductNotFoundException from '../../exceptions/ProductNotFoundException';
import CreateProductDto from './products.dto';
import validationMiddleware from '../../middleware/validation.middleware';

class ProductsController implements Controller {
	public path = '/products';
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(this.path, this.getAllProducts);
		this.router.get(`${this.path}/:id`, this.getProductById);
		this.router.post(this.path, validationMiddleware(CreateProductDto), this.createProducts);
		this.router.patch(
			`${this.path}/:id`,
			validationMiddleware(CreateProductDto, true),
			this.modifyProduct
		);
		this.router.delete(`${this.path}/:id`, this.deleteProduct);
	}

	async getAllProducts(req: Request, res: Response): Promise<void> {
		const products: Product[] = await productModel.find();

		res.send(products);
	}

	async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;
		const product = await productModel.find({ id });

		if (product.length === 0) {
			next(new ProductNotFoundException(id));
		}

		res.send(product);
	}

	async createProducts(req: Request, res: Response): Promise<void> {
		const productData: CreateProductData = await req.body;
		const id: string = uuid();

		const createdProduct = await new productModel({ ...productData, id });
		createdProduct.save().then((product: Product) => {
			res.send(product);
		});
	}

	async modifyProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id: string = req.params.id;
		const productData: any = req.body;

		const updateProduct = await productModel.findOneAndUpdate(
			{ id },
			{
				$set: { ...productData },
			},
			{ new: true }
		);

		if (!updateProduct) {
			next(new ProductNotFoundException(id));
		}

		res.send(updateProduct);
	}

	async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.id;

		const product = await productModel.find({ id });
		if (product.length === 0) {
			next(new ProductNotFoundException(id));
		} else {
			await productModel.find({ id }).remove();
			res.send(true);
		}
	}
}

export default ProductsController;
