import {body}        from "express-validator";
import {User}        from "../models/user.js";
import bcrypt        from "bcryptjs";
import {findByField} from "../repository/User/findOne.js";

const loginValidation = [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.custom(async (
			email,
		) => {
			const user = await findByField({email: email})
			if (!user) {
				return Promise.reject('Wrong Email!');
			}
		}),
	body('password')
		.custom(async (
			value,
			{req}
		) => {
			const email = req.body.email
			const user = await findByField({email: email})
			if (user && !await bcrypt.compare(
				value,
				user.password
			)) {
				return Promise.reject('Wrong Password!');
			}
		})
]

export default loginValidation
