import bcrypt from "bcryptjs";


export const checkPassword = async (req,user) => {
    await bcrypt.compare(
        req.body.password,
        user.password
    )
}
