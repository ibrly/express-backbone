import nodemailer  from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'
import BaseError   from "../exceptionHandler/baseError.js";

const mailer = async (
	to,
	subject,
	text,
	html
) => {
	const options = {
		auth: {
			api_key: 'process.env.SENDGRID_API_KEY'
		}
	};
	const client = nodemailer.createTransport(sgTransport(options));
	return await client.sendMail(
		{
			from   : process.env.FROM_EMAIL,
			to     : to,
			subject: subject,
			text   : text,
			html   : html
		},
		async function (
			error,
			info
		) {
			if (error) {
				new BaseError(
					'email sender',
					500,
					error.message,
					false,
					error
				)
			}
		}
	)
}
export default mailer
