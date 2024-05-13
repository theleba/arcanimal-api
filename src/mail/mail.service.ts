import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';  

@Injectable()
export class EmailService {
	constructor(private mailerService: MailerService) {}

	async sendWelcomeEmail(user: { name: string; email: string; password: string }) {
	await this.mailerService.sendMail({
		to: user.email,
		subject: '[Arcanimal] Bem vindo!',
		template: './welcome', 
		context: {
			name: user.name,
			email: user.email,
			password: user.password
		},
		attachments: [
			{
				filename: 'logo-arcanimal.png',
				path: join(process.cwd(), 'assets/logo-arcanimal.png'),  
				cid: 'logo'
			}
		]
	});
	}

	async sendRecoverPasswordEmail(user: { name: string; email: string; password: string }) {
		await this.mailerService.sendMail({
			to: user.email,
			subject: '[Arcanimal] Recuperar Senha',
			template: './recover-password',
			context: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
			attachments: [
				{
				filename: 'logo-arcanimal.png',
				path: join(process.cwd(), 'assets/logo-arcanimal.png'), 
				cid: 'logo'
				}
			]
		});
	}
}
