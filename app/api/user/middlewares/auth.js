import {idFromToken} from "../../../services/idFromToken.js";

export const isAuth = (req,
                       res,
                       next) => {
    req.userId = idFromToken(req).userId; // set by JWTSign
    next();
};
