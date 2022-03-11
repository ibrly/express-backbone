import express       from "express";
import {Auth}        from '../controllers/auth.js';
import {Validations} from "../validations/index.js";
import {isAuth}      from "../middlewares/auth.js";

const router = express.Router();
router.post(
    '/signup',
    Validations.signUpValidation,
    Auth.signup
)
router.post(
    '/login',
    Auth.login
);
router.get(
    '/me',
    isAuth,
    Auth.me
);
router.put(
    '/user',
    isAuth,
    Auth.updateUser
);
router.get(
    '/user',
    Auth.getUsers
);
router.delete(
    '/user/:id',
    Auth.deleteUser
);
export default router;
