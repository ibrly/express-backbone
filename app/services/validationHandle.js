import {validationResult} from "express-validator";
import BaseError          from "../exceptionHandler/baseError.js";
import {HttpStatusCode}   from "../exceptionHandler/errorStatus.js";

const validationHandle = (
	req,
	title,
	message
) => {
	if (!validationResult(req)
		.isEmpty()) {
		throw new BaseError(
			title,
			HttpStatusCode.BAD_REQUEST,
			message,
			true,
			validationResult(req)
				.array()
		);
	}
}
export default validationHandle
