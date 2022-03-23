import nodemailer  from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

const mailer = async (
	to,
	subject,
	text,
	html
) => {
	const options = {
		auth: {
			api_key: process.env.SENDGRID_API_KEY
		}
	};
	const client = nodemailer.createTransport(sgTransport(options));
	await client.sendMail(
		{
			from   : process.env.FROM_EMAIL,
			to     : to,
			subject: subject,
			text   : text,
			html   : html
		},
		async function (
			err,
			info
		) {
			if (await err) {
				console.log(err);
			} else {
				console.log(info);
			}
		}
	)
}
export default mailer
