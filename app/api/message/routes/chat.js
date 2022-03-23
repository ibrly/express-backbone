import express from "express";
import {sendMessage} from "../controllers/sendMessage.js";
import {getChat} from "../controllers/getChat.js";


const router = express.Router();
router.post(
    '/',
    sendMessage
)

router.get(
    '/',
    getChat
);
export default router;
