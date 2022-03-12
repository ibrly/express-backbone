import {body} from "express-validator";
import {User} from "../models/user.js";
import bcrypt from "bcryptjs";

const loginValidation =
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
		body('password')
			.custom(async (
				value,
				{req}
			) => {
				const user =
					await User.findOne({
										   where:
											   {email: req.body.email}
									   })
				
				if (!user) {
					return Promise.reject('Wrong Email!');
				} else if (user && !await bcrypt.compare(
					value,
					user.password
				)) {
					return Promise.reject('Wrong Password!');
					
				}
			})
	]

export default loginValidation
