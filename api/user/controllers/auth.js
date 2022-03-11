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
import {checkPassword}    from "../services/checkPassword.js";


export class Auth {
	static signup = async (
		req,
		res,
		next
	) => {
		const errors = validationResult(req);
		//validation
		if (!errors.isEmpty()) {
			const error = new Error('Sign up Validation Failed');
			error.statusCode = 422;
			error.data = errors.array();
			next(error)
		}
		
		try {
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
			const user = await findLogin(req)
			!user ? handleError(
				401,
				'A user with this email could not be found.'
			) : ''
			await checkPassword(
				req,
				user
			) ? handleError(
				401,
				'Wrong password!'
			) : ''
			//sign password
			res.status(200)
			   .json(userAuth(user))
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
	static  getUsers = async (
		req,
		res,
		next
	) => {
		
		try {
			const Users = await findUsers(req)
			res.status(200)
			   .json(Users)
		} catch (e) {
			res.json(e)
		}
	};
	
	static  updateUser = async (
		req,
		res,
		next
	) => {
		const user = await updateSelfUser(req)
		handleResponse(
			res,
			201,
			{
				message: 'User Updated Successfully!',
				user
			}
		)
	};
	
	static  deleteUser = async (
		req,
		res,
		next
	) => {
		try {
			await deleteSelfUser(req)
			handleResponse(
				res,
				201,
				{message: 'User Deleted Successfully!'}
			)
		} catch (err) {
			res.json(err)
		}
	};
}
