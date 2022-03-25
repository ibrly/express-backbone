import {Sequelize} from "sequelize";

export const sequelize = new Sequelize(
	`${process.env.DATABASE}`,
	`${process.env.DATABASE_USER}`,
	`${process.env.DATABASE_PASSWORD}`,
	{
		dialect: `${process.env.DATABASE_DIALECT}`,
		port   : `${process.env.DATABASE_PORT}`,
		host   : `${process.env.DATABASE_HOST}`,
	}
);


