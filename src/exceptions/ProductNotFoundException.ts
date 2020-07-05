import HttpException from './HttpException';

class ProductNotFoundException extends HttpException {
	constructor(id: string) {
		super(404, `Post with id ${id} not found`);
	}
}

export default ProductNotFoundException;
