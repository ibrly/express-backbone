import {idFromToken} from "../../../services/idFromToken.js";

export const isAuth = (req,
                       res,
                       next) => {
    idFromToken(req)
    next();
};
