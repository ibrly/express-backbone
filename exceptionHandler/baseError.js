export default class BaseError extends Error {
	constructor(
		name,
		statusCode,
		message,
		isOperational,
		data
	) {
		super(message);
		Object.setPrototypeOf(
			this,
			new.target.prototype
		);
		this.name = name;
		this.data = data;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		Error.captureStackTrace(this)
	}
}
