import { Schema, Document, model } from 'mongoose';
import User from './user.interface';
import crypto from 'crypto';

const hash = {
	length: 128,
	iterations: 10,
};

const userSchema = new Schema({
	email: String,
	password: String,
});

const generatePassword = (salt: string, password: string) => {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, salt, hash.length, hash.iterations, 'sha512', (err, key) => {
			if (err) return reject(err);
			resolve(key.toString('hex'));
		});
	});
};

userSchema.methods.setPassword = async function (password: string) {
	if (password !== undefined) {
		if (password.length < 4) {
			throw new Error('Пароль должен быть минимум 4 символа.');
		}
	}

	this.salt = crypto.randomBytes(hash.length).toString('hex');
	this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (password: string) {
	if (!password) return false;

	const hash = await generatePassword(this.salt, password);
	return hash === this.passwordHash;
};

const userModel = model<User & Document>('User', userSchema);

export default userModel;
