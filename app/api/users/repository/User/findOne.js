import {User} from "../../models/user.js";
import {Op} from "sequelize";
import {idFromToken} from "../../../../services/idFromToken.js";


export const findLogin = async (req) => {
    return await User.findOne({
        where: {
            [Op.or]: {
                email: {[Op.eq]: req.body.email},
                name: {[Op.eq]: req.body.name}
            }
        }
    })
}

export const findJwt = async (req) => {
    let decodedToken = await idFromToken(req)
    return await User.findByPk(decodedToken.userId)
}
