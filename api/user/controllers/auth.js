import {validationResult} from "express-validator";
import {handleError}      from "../../../services/handleError.js";
import {handleResponse}   from "../../../services/handleResponse.js";
import {createUser}       from "../repository/User/create.js";
import {
	findJwt,
	findLogin
}                         from "../repository/User/findOne.js";
import {findUsers}        from "../repository/User/find.js";
import {updateSelfUser}   from "../repository/User/update.js";
import {deleteSelfUser}   from "../repository/User/delete.js";
import {userAuth}         from "../resources/userAuth.js";
import BaseError          from "../../../exceptionHandler/baseError.js";
import {HttpStatusCode}   from "../../../exceptionHandler/errorStatus.js"

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
