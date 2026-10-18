import jwt from "jsonwebtoken";

export const idFromToken = (req) => {
	const authHeader = req.get('Authorization')
	if (!authHeader) {
		const error = new Error('Not authenticated')
		error.statusCode = 401;
		throw error;
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(
			token,
			process.env.JWT_PRIVATE_KEY
		)
	} catch (err) {
		// malformed, wrongly signed or expired: the client has to authenticate again
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}
	if (!decodedToken) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw  error;
	}
	return decodedToken
}
