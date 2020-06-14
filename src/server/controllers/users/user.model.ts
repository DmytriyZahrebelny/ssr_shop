import { Schema, Document, model } from 'mongoose';
import User from './user.interface';

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
