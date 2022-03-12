import {findUsers}      from "../repository/User/find.js";
import {updateSelfUser} from "../repository/User/update.js";
import {handleResponse} from "../../../services/handleResponse.js";
import {deleteSelfUser} from "../repository/User/delete.js";

export class Crud {
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
		await handleResponse(
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
			await handleResponse(
				res,
				201,
				{message: 'User Deleted Successfully!'}
			)
		} catch (err) {
			res.json(err)
		}
	};
}
