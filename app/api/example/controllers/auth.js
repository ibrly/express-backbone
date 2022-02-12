import {User}             from "../models/user.js";
import {validationResult} from "express-validator";
import bcrypt             from 'bcryptjs';
import jwt                from "jsonwebtoken";
import {Op}               from 'sequelize';
import qs                 from 'qs';
import {idFromToken}      from "../../services/idFromToken.js";
import {clearImage}       from "../../services/clearImage.js";
import {handleError}      from "../../services/handleError.js";
import {handleResponse}   from "../../services/handleResponse.js";

export class Auth {
    static signup = async (req,
                           res,
                           next) => {
        const errors = validationResult(req);
        //validation
        if (!errors.isEmpty()) {
            const error      = new Error('Index failed.');
            error.statusCode = 422;
            error.data       = errors.array();
            throw error;
        }

        try {
            const hashedPw   = await bcrypt.hash(req.body.password,
                                                 12)
            const loadedUser = await User.create({
                                                     firstName     : req.body.firstName,
                                                     lastName      : req.body.lastName,
                                                     name          : req.body.name,
                                                     email         : req.body.email,
                                                     password      : hashedPw,
                                                     phone         : req.body.phone,
                                                     profilePicture: req.file?.path.replace("\\",
                                                                                            "/"),
                                                     role          : 'Authenticated'
                                                 })
            const token      = await jwt.sign(
                {
                    email : loadedUser.email,
                    userId: loadedUser.id.toString()
                },
                process.env.JWT_PRIVATE_KEY,
                {expiresIn: process.env.JWT_EXPIRES_IN}
            );
            res.status(200)
               .json({
                         jwt : {
                             token    : token,
                             expiresIn: 3600,
                         },
                         user: {
                             id       : loadedUser.id.toString(),
                             email    : loadedUser.email,
                             name     : loadedUser.name,
                             role     : loadedUser.role,
                             firstName: loadedUser.firstName,
                             lastName : loadedUser.lastName,
                             phone    : loadedUser.phone,
                             picture  : loadedUser.profilePicture,
                             status   : loadedUser.status
                         }
                     })
        }
        catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }

    static  login = async (
        req,
        res,
        next
    ) => {
        //now you can login with username or email
        try {
            const user = await User.findOne({
                                                where: {
                                                    [Op.or]: {
                                                        email: {[Op.eq]: req.body.email},
                                                        name : {[Op.eq]: req.body.name}
                                                    }
                                                }
                                            })
            !user ? handleError(401,
                                'A user with this email could not be found.') : ''
            //check password
            const comparePassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            !comparePassword ? handleError(401,
                                           'Wrong password!') : ''
            //sign password
            const token = jwt.sign(
                {
                    email : user.email,
                    userId: user.id.toString(),
                },
                process.env.JWT_PRIVATE_KEY,
                {expiresIn: '1h'}
            );
            res.status(200)
               .json({
                         jwt : {
                             token    : token,
                             expiresIn: 3600,
                         },
                         user: {
                             id       : user.id.toString(),
                             email    : user.email,
                             name     : user.name,
                             role     : user.role,
                             firstName: user.firstName,
                             lastName : user.lastName,
                             phone    : user.phone,
                             picture  : user.profilePicture,
                             status   : user.status
                         }
                     })
        }
        catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }

    static me        = async (req,
                              res,
                              next) => {
        try {
            let decodedToken = await idFromToken(req)
            let loadedUser   = await User.findByPk(decodedToken.userId)
            if (loadedUser) {
                res.status(200)
                   .json({
                             jwt : {
                                 token    : jwt.sign(
                                     {
                                         email : loadedUser.email,
                                         userId: loadedUser.id.toString(),
                                     },
                                     process.env.JWT_PRIVATE_KEY,
                                     {expiresIn: '1h'}
                                 ),
                                 expiresIn: 3600,
                             },
                             user: {
                                 id       : loadedUser.id.toString(),
                                 email    : loadedUser.email,
                                 name     : loadedUser.name,
                                 role     : loadedUser.role,
                                 firstName: loadedUser.firstName,
                                 lastName : loadedUser.lastName,
                                 phone    : loadedUser.phone,
                                 picture  : loadedUser.profilePicture,
                                 status   : loadedUser.status
                             }
                         })
            }
            else {
                const error      = new Error('There is no user')
                error.statusCode = 401;
            }

        }
        catch (err) {
            err.statusCode = 500;
            throw err;
        }

    }
    static  getUsers = async (
        req,
        res,
        next
    ) => {
        const query = qs.parse(req.query)
        try {
            const Users = await User.findAndCountAll({
                                                         limit : parseInt(query.limit),
                                                         offset: (parseInt(query.page) * parseInt(query.limit)),
                                                         where : {
                                                             [Op.or]:
                                                                 {[query.searchBy]: {[Op.substring]: query.search}}
                                                         },
                                                         order : [
                                                             [
                                                                 query.sortBy,
                                                                 query.sortHow
                                                             ]
                                                         ]
                                                     })
            res.status(200)
               .json(Users)
        }
        catch (e) {
            res.json(e)
        }
    };

    static  updateUser = async (
        req,
        res,
        next
    ) => {
        const decodedToken = idFromToken(req)
        let user           = await User.findByPk(decodedToken.userId)
        !user ? handleError(401,
                            'Wrong Credentials Please re-login and try again') : ''

        user.name           = req.body?.name;
        user.firstName      = req.body?.firstName;
        user.lastName       = req.body?.lastName;
        user.email          = req.body?.email;
        user.phone          = req.body?.phone;
        user.profilePicture = req.file?.path.replace("\\",
                                                     "/");
        await user.save()
        handleResponse(res,
                       201,
                       {
                           message: 'User Updated Successfully!',
                           user
                       })
    };

    static  deleteUser = async (
        req,
        res,
        next
    ) => {
        try {
            let user = await User.findByPk(req.params.id)
            !user ? handleError(401,
                                'Wrong Credentials Please re-login and try again') : ''
            user.imageUrl ? clearImage(user?.imageUrl) : ''
            await user.destroy()
            handleResponse(res,
                           201,
                           {message: 'User Deleted Successfully!'})
        }
        catch (err) {
            res.json(err)
        }

    };
}
