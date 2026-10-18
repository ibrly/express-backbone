import express from "express";
import {sendMessage} from "../controllers/sendMessage.js";
import {getChat} from "../controllers/getChat.js";
import {isAuth} from "../../user/middlewares/auth.js";


const router = express.Router();
router.post(
    '/',
    isAuth,
    sendMessage
)

router.get(
    '/',
    isAuth,
    getChat
);
export default router;
