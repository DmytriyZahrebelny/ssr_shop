import mongoose from 'mongoose';
import { Product } from './products.interface';

const productSchema = new mongoose.Schema(
	{
		id: String,
		image: String,
		price: String,
		title: String,
		type: String,
		description: String,
	},
	{
		timestamps: true,
	}
);

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;
