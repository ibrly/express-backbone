import {JWTSign} from "../services/JWTSign.js";


export const userAuth = async (
	user
) => {
	const token = await JWTSign(user)
	return {
		jwt : {
			token    : token,
			expiresIn: process.env.JWT_EXPIRES_IN,
		},
		user: {
			id       : user.id.toString(),
			email    : user.email,
			name     : user.name,
			role     : user.role,
			firstName: user.firstName,
			lastName : user.lastName,
			phone    : user.phone,
			picture  : user.profilePicture,
			status   : user.status
		}
	}
}
