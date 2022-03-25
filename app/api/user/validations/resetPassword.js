import {
	body,
	header
}                    from "express-validator";
import {User}        from "../models/user.js";
import {idFromToken} from "../../../services/idFromToken.js";
import {findJwt}     from "../repository/User/findOne.js";

const resetPasswordValidation = [
	body('password')
		.trim()
		.isLength({min: 5})
		.withMessage('Password must be more than 5 alphanumeric characters')
		.isAlphanumeric()
		.withMessage('Password must be alphanumeric'),
	body('confirmPassword')
		.custom((
					value,
					{req}
				) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match!');
			}
			return true
		}),
	header('Authorization')
		.not()
		.isEmpty()
		.custom(async (
			value,
			{req}
		) => {
			const user = await findJwt(req)
			if (!user) {
				return Promise.reject('Wrong Link!');
			}
		})

]

export default resetPasswordValidation
