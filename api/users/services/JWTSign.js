import jwt from "jsonwebtoken";


export const JWTSign = async (user) => {
   return await jwt.sign(
        {
            email: user.email,
            userId: user.id.toString()
        },
        process.env.JWT_PRIVATE_KEY,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    )

}
