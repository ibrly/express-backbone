import {body} from "express-validator";
import {User} from "../models/user.js";
import {
	findByField
}             from "../repository/User/findOne.js";

const signUpValidation = [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.custom(async (
			email) => {
			return await findByField({email: email})
				.then(userDoc => {
					if (userDoc) {
						return Promise
							.reject('E-Mail address already exist!');
					}
				})
		})
		.normalizeEmail(),
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
		}),
	body('name')
		.trim()
		.not()
		.isEmpty()
		.withMessage('User name should be not empty')
		.isLength({min: 5})
		.withMessage('User name must be more than 5 characters')
		.isAlpha()
		.withMessage('User name must be only characters')
		.custom(async (
			name) => {
			return await findByField({name: name})
				.then(userDoc => {
					if (userDoc) {
						return Promise
							.reject('Username address already exist!');
					}
				})
		}),
	body('phone')
		.not()
		.isEmpty()
		.withMessage('Mobile number is required')
		.isMobilePhone('ar-EG')
		.withMessage('Mobile number must be an egyptian number')
		.custom(async (
			phone) => {
			return await findByField({phone: phone})
				.then(userDoc => {
					if (userDoc) {
						return Promise
							.reject('Phone number already exist!');
					}
				})
		})
]

export default signUpValidation
