import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { loggerMiddleware } from './middleware/logger.middleware';
import Controller from './interfaces/controller.interface';

class App {
	public app: Application;

	constructor(controllers: Controller[]) {
		this.app = express();

		this.connectToTheDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
		this.app.use(loggerMiddleware);
	}

	private initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller: Controller) => {
			this.app.use('/', controller.router);
		});
	}

	public listen(): void {
		this.app.listen(process.env.PORT, () => {
			console.log(`App listening on the port ${process.env.PORT}`);
		});
	}

	private connectToTheDatabase(): void {
		const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
		mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
}

export default App;
