import { IsString } from 'class-validator';

class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	public price: string;

	@IsString()
	public title: string;

	@IsString()
	public type: string;

	@IsString()
	public description: string;
}

export default CreateProductDto;
