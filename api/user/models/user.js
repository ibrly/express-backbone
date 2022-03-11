import Sequelize from "sequelize";
import {sequelize} from "../../../util/database.js";
import {Messages}  from "../../message/models/messages.js";


export const User = sequelize.define('user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Authenticated'
        },
        profilePicture: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'I am new!'
        },
        resetLink: {
            type: Sequelize.STRING,
            defaultValue: ''
        }
    });

User.hasMany(Messages)
