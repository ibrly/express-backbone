import {Messages} from "../models/messages.js";


export const getChat = async (
    req,
    res,
    next
) => {
    try {
        const chat = await Messages.findAndCountAll()
        res.status(200)
            .json(chat)
    } catch (e) {
        res.json(e)
    }
}
