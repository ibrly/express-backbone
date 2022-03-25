import {body} from "express-validator";
import {User} from "../models/messages.js";

export class Validations {
	//every request has its own validation class
	static  signUpValidation =
		[
			body('email')
				.isEmail()
				.withMessage('Please enter a valid email')
				.custom((
							value,
							{req}
						) => {
					return User.findOne({
											where:
												{email: value}
										})
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
				.withMessage('User name must be only characters'),
			body('phone')
				.not()
				.isEmpty()
				.withMessage('Mobile number is required')
				.isMobilePhone('ar-EG')
				.withMessage('Mobile number must be an egyptian number')
		]
}
