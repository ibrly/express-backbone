import Sequelize from "sequelize";
import {sequelize} from "../../../util/database.js";


export const Messages = sequelize.define('message',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

