import {Messages} from "../models/messages.js";


export const sendMessage = async (
    req,
    res,
    next
) => {
    try {
        const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
        if (!message) {
            const error = new Error('message is required');
            error.statusCode = 400;
            throw error;
        }
        await Messages.create({message, userId: req.userId})
        res.status(200)
            .json({message: 'success'})
    } catch (e) {
        next(e)
    }
}
