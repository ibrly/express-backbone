import {validationResult} from "express-validator";
import {handleError}      from "../../../services/handleError.js";
import {handleResponse}   from "../../../services/handleResponse.js";
import {createUser}       from "../repository/User/create.js";
import {
	findJwt,
	findLogin
}                         from "../repository/User/findOne.js";
import {userAuth}         from "../resources/userAuth.js";
import BaseError          from "../../../exceptionHandler/baseError.js";
import {HttpStatusCode}   from "../../../exceptionHandler/errorStatus.js"
import {User}             from "../models/user.js";
import mailer             from "../../../util/mailer.js";
import {JWTSign}          from "../services/JWTSign.js";
import {idFromToken}      from "../../../services/idFromToken.js";
import bcrypt             from 'bcryptjs'

export class Auth {
	static signup = async (
		req,
		res,
		next
	) => {
		
		try {
			//validation
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				next(new BaseError(
					'Sign Up',
					HttpStatusCode.BAD_REQUEST,
					'Sign up Validation Failed',
					true,
					errors.array()
				));
			}
			
			const loadedUser = await createUser(req)
			await handleResponse(
				res,
				200,
				userAuth(await loadedUser)
			)
			
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	
	static  login = async (
		req,
		res,
		next
	) => {
		//now you can login with username or email
		try {
			if (!validationResult(req)
				.isEmpty()) {
				next(new BaseError(
					'Login',
					HttpStatusCode.BAD_REQUEST,
					'Log in Validation Failed',
					true,
					validationResult(req)
						.array()
				));
			} else {
				const user = await findLogin(req)
				await handleResponse(
					res,
					200,
					await userAuth(user)
				)
				
				
			}
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	
	
	static forgetPassword = async (
		req,
		res,
		next
	) => {
		
		try {
			if (!validationResult(req)
				.isEmpty()) {
				next(new BaseError(
					'Forget Password',
					HttpStatusCode.BAD_REQUEST,
					'Forget Password Validation Failed',
					true,
					validationResult(req)
						.array()
				));
			}
			
			const user = await User.findOne({where: {email: req.body.email}})
			const token = await JWTSign(user)
			user.resetLink = token;
			await user.save()
			console.log(user.email)
			await mailer(
				user.email,
				'Reset Password Link',
				`Hello ${user.name} Please Follow this link to reset password ${process.env.FRONT_END_URL}reset-password/${token} this link will expire in 15 minutes`,
				`<h1>Hello ${user.name} </h1><p><a href='${process.env.FRONT_END_URL}reset-password/${token}'>Please check this link to reset password</a>this link will expire in 15 minutes</p>`
			)
			res.status(200)
			   .json({message: `Email sent to ${user.email} successfully please follow the instructions`})
		} catch (e) {
			if (!e.statusCode) {
				e.statusCode = 500;
			}
			next(e)
		}
		
	}
	static resetPassword = async (
		req,
		res,
		next
	) => {
		if (!validationResult(req)
			.isEmpty()) {
			next(new BaseError(
				'Forget Password',
				HttpStatusCode.BAD_REQUEST,
				'Forget Password Validation Failed',
				true,
				validationResult(req)
					.array()
			));
		}
		
		
		const restLink = req.get('Authorization');
		const user = await User.findOne({where: {resetLink: restLink.split(' ')[1]}})
		
		try {
			idFromToken(req)
			if (!user) {
				const error = new Error('Not authenticated');
				error.statusCode = 401;
				throw error;
			}
			const password = req.body.password;
			user.password = await bcrypt.hash(
				password,
				12
			);
			user.resetLink = '';
			await user.save();
			await mailer(
				user.email,
				'Password Changed Successfully!',
				`Hello ${user.name} your password successfully changed`,
				`<h1>Hello ${user.name} your password successfully changed</h1>`
			)
			res.json({message: 'Password Changed Successfully'})
			
		} catch (e) {
			if (!e.statusCode) {
				e.statusCode = 500;
			}
			next(e);
			
		}
	}
	static me = async (
		req,
		res,
		next
	) => {
		try {
			let loadedUser = findJwt(req)
			!loadedUser ? handleError(
				401,
				'There is no user'
			) : ''
			res.status(200)
			   .json(userAuth(loadedUser))
		} catch (err) {
			err.statusCode = 500;
			throw err;
		}
		
	}
	
}
