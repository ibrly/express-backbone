import qs from "qs";
import {User} from "../../models/user.js";
import {Op} from "sequelize";


export const findUsers = async (req) => {
    const query = qs.parse(req.query)
    return await User.findAndCountAll({
        limit: parseInt(query.limit),
        offset: (parseInt(query.page) * parseInt(query.limit)),
        where: {
            [Op.or]:
                {[query.searchBy]: {[Op.substring]: query.search}}
        },
        order: [
            [
                query.sortBy,
                query.sortHow
            ]
        ]
    })
}
