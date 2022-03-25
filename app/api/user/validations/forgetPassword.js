import {body}        from "express-validator";
import {findByField} from "../repository/User/findOne.js";

const forgetPasswordValidation =
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.custom(async (
				email
			) => {
				const user = await findByField({email: email})
				if (!user) {
					return Promise.reject('Wrong Email!');
				}
			}),
	]

export default forgetPasswordValidation
