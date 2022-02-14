import {idFromToken} from "../../../../services/idFromToken.js";
import {User} from "../../models/user.js";
import {handleError} from "../../../../services/handleError.js";


export const updateSelfUser = async (req) => {
    const decodedToken = idFromToken(req)
    let user = await User.findByPk(decodedToken.userId)
    !user ? handleError(401,
        'Wrong Credentials Please re-login and try again') : ''

    user.name = req.body?.name;
    user.firstName = req.body?.firstName;
    user.lastName = req.body?.lastName;
    user.email = req.body?.email;
    user.phone = req.body?.phone;
    user.profilePicture = req.file?.path.replace("\\",
        "/");
    return await user.save()
}
