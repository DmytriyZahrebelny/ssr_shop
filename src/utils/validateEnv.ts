import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
	cleanEnv(process.env, {
		JWT_SECRET: str(),
		MONGO_PASSWORD: str(),
		MONGO_PATH: str(),
		MONGO_USER: str(),
		PORT: port(),
	});
}

export default validateEnv;
