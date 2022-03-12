import express          from "express";
import {Auth}           from '../controllers/auth.js';
import signUpValidation from "../validations/signup.js";
import {isAuth}         from "../middlewares/auth.js";
import loginValidation  from "../validations/login.js";
import {Crud}           from "../controllers/crud.js";

const router = express.Router();
router.post(
	'/signup',
	signUpValidation,
	Auth.signup
)
router.post(
	'/login',
	loginValidation,
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
	Crud.updateUser
);
router.get(
	'/user',
	Crud.getUsers
);
router.delete(
	'/user/:id',
	Crud.deleteUser
);
export default router;
