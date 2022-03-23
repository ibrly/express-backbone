import express          from "express";
import {isAuth}         from "../../middlewares/auth.js";
import {Crud}           from "../../controllers/crud.js";

const router = express.Router();
router.get(
	'/user',
	Crud.getUsers
);
router.put(
	'/user',
	isAuth,
	Crud.updateUser
);
router.delete(
	'/user/:id',
	Crud.deleteUser
);
export default router;
