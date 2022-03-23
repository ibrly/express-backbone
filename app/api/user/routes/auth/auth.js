import express                  from "express";
import {Auth}                   from '../../controllers/auth.js';
import signUpValidation         from "../../validations/signup.js";
import {isAuth}                 from "../../middlewares/auth.js";
import loginValidation          from "../../validations/login.js";
import forgetPasswordValidation from "../../validations/forgetPassword.js";
import resetPasswordValidation  from "../../validations/resetPassword.js";

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
router.post(
	'/forget-password',
	forgetPasswordValidation,
	Auth.forgetPassword
);
router.post(
	'/reset-password',
	resetPasswordValidation,
	Auth.resetPassword
);
router.get(
	'/me',
	isAuth,
	Auth.me
);
export default router;
