const nodemailer = require('nodemailer');

const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER;

const transport = nodemailer.createTransport(
	{
		service: 'Gmail',
		auth: {
			user: user,
			pass: process.env.NM_PASS
		}
	}
)

module.exports.sendValidationEmail = (name, email, id, activationToken) => {
	transport.sendMail({
		to: email,
		from: `Storanized <${user}>`,
		subject: 'Wellcome to Storanized, please activate your account!',
		html: `
			<h1>Hi ${name}</h1>
			<p>Click on the button below to activate your account ❤️</p>
			<a href="${host}/activate/${id}/${activationToken}" style="padding: 10px 20px; color: white; background-color: red; border-radius: 0px;">Click here</a>
		`
	})
}

module.exports.sendDuplicateEmail = (name, email, id, activationToken) => {
	transport.sendMail({
		to: email,
		from: `Storanized <${user}>`,
		subject: 'New singup detected',
		html: `
			<h1>Hi ${name}</h1>
			<p>We have detected a new registration, but you are already a Storanized user, if it was you you can change your password in the following <a href="${host}/password/${id}/${activationToken}" style="padding: 10px 20px; color: white; background-color: red; border-radius: 0px;">link</a>.

			Best regards the Storanize team.</p>
		`
	})
}