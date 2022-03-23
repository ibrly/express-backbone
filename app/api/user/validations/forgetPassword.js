import {body} from "express-validator";
import {User} from "../models/user.js";

const forgetPasswordValidation =
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.custom(async (
				value,
				{req}
			) => {
				const user = await User.findOne({where: {email: value}})
				if (!user) {
					return Promise.reject('Wrong Email!');
				}
			}),
	]

export default forgetPasswordValidation
