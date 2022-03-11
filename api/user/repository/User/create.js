import {User}        from "../../models/user.js";
import bcrypt        from "bcryptjs";
import {handleError} from "../../../../services/handleError.js";


export const createUser = async (req) => {
	try {
		const hashedPw = await bcrypt.hash(
			req.body.password,
			12
		)
		return await User.create({
									 firstName     : req.body.firstName,
									 lastName      : req.body.lastName,
									 name          : req.body.name,
									 email         : req.body.email,
									 password      : hashedPw,
									 phone         : req.body.phone,
									 profilePicture: req.file?.path.replace(
										 "\\",
										 "/"
									 ),
									 role          : 'Authenticated'
								 })
	} catch (e) {
		handleError(
			401,
			'Cannot create user please try again'
		)
	}
}
