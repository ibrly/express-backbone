import BaseError from "../exceptionHandler/baseError.js";

export const handleError = (
	name,
	statusCode,
	message,
	isOperational,
	data
) => {
	throw new BaseError(
		name,
		statusCode,
		message,
		isOperational,
		data
	);
	
}
