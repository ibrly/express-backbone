import {User} from "../../models/user.js";
import bcrypt from "bcryptjs";


export const createUser = async (req) => {
    const hashedPw = await bcrypt.hash(req.body.password,
        12)
    return await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: req.body.name,
        email: req.body.email,
        password: hashedPw,
        phone: req.body.phone,
        profilePicture: req.file?.path.replace("\\",
            "/"),
        role: 'Authenticated'
    })
}
