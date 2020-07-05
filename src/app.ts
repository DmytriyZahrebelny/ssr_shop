import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { loggerMiddleware } from './middleware/logger.middleware';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
	public app: Application;

	constructor(controllers: Controller[]) {
		this.app = express();

		this.connectToTheDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
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

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	public listen(): void {
		this.app.listen(process.env.PORT, () => {
			console.log(`App listening on the port ${process.env.PORT}`);
		});
	}

	private connectToTheDatabase(): void {
		const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

		mongoose.set('debug', true);
		mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
}

export default App;
