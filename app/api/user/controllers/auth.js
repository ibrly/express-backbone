import {handleError}    from "../../../services/handleError.js";
import {handleResponse} from "../../../services/handleResponse.js";
import {createUser}     from "../repository/User/create.js";
import {
	findJwt,
	findLogin
}                       from "../repository/User/findOne.js";
import {userAuth}       from "../resources/userAuth.js";
import {User}           from "../models/user.js";
import mailer           from "../../../util/mailer.js";
import {JWTSign}        from "../services/JWTSign.js";
import bcrypt           from 'bcryptjs'
import validationHandle from "../../../services/validationHandle.js";

export class Auth {
	static signup = async (
		req,
		res,
		next
	) => {
		try {
			//validation
			validationHandle(
				req,
				'Sign Up',
				'Sign up Validation Failed'
			)
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
			validationHandle(
				req,
				'Login',
				'Log in Validation Failed'
			)
			const user = await findLogin(req)
			await handleResponse(
				res,
				200,
				await userAuth(user)
			)
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
			validationHandle(
				req,
				'Forget Password',
				'Forget Password Validation Failed'
			)
			const user = await User.findOne({where: {email: req.body.email}})
			const token = await JWTSign(user)
			user.resetLink = token;
			await user.save()
			await mailer(
				user.email,
				'Reset Password Link',
				`Hello ${user.name} Please Follow this link to reset password ${process.env.FRONT_END_URL}reset-password/${token} `,
				`<h1>Hello ${user.name} </h1><p><a href='${process.env.FRONT_END_URL}reset-password/${token}'>Please check this link to reset password</a></p>`
			)
			await handleResponse(
				res,
				200,
				{message: `Email sent to ${user.email} successfully please follow the instructions`}
			)
			
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
		try {
			validationHandle(
				req,
				'Reset Password',
				'Reset Password Validation Failed'
			)
			const restLink = req.get('Authorization');
			const user = await User.findOne({where: {resetLink: restLink.split(' ')[1]}})
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
			await handleResponse(
				res,
				200,
				{
					message: `Password Changed Successfully`
				}
			)
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
			await handleResponse(
				res,
				200,
				userAuth(loadedUser)
			)
		} catch (err) {
			err.statusCode = 500;
			next(err);
		}
		
	}
	
}
