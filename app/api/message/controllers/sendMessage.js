import {Messages} from "../models/messages.js";


export const sendMessage = async (
    req,
    res,
    next
) => {
    await Messages.create({message: req.body.message, userId: 1})
    res.status(200)
        .json({message: 'success'})
}
