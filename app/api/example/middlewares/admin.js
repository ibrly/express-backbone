import {User}        from "../models/user";
import {idFromToken} from "../../services/idFromToken";

export const isAdmin = (
    req,
    res,
    next
) => {
    const id = idFromToken(req).userId
    User.findAll({
                     where: {
                         id    : id,
                         status: 'Admin'
                     }
                 })
        .then(result => {
            if (result.length === 1) {
                next();
            }
            else if (result.length === 0) {
                const error      = new Error('Not Admin')
                error.statusCode = 401;
                throw error;
            }
        })
};
