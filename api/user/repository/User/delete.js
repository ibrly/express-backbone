import {User} from "../../models/user.js";
import {handleError} from "../../../../services/handleError.js";
import {clearImage} from "../../../../services/clearImage.js";


export const deleteSelfUser = async (req) => {
    let user = await User.findByPk(req.params.id)
    !user ? handleError(401,
        'Wrong Credentials Please re-login and try again') : ''
    user.imageUrl ? clearImage(user?.imageUrl) : ''
    await user.destroy()
}
