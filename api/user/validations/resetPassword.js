import {body} from "express-validator";

const resetPasswordValidation =
	[
		body('password')
			.trim()
			.isLength({min: 5})
			.withMessage('Password must be more than 5 alphanumeric characters')
			.isAlphanumeric()
			.withMessage('Password must be alphanumeric'),
		body('confirmpassword')
			.custom((
						value,
						{req}
					) => {
				if (value !== req.body.password) {
					throw new Error('Passwords have to match!');
				}
				return true
			})
	]

export default resetPasswordValidation
