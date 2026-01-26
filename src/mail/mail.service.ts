import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService,) { }

    public async sendLoginEmail(email: string, userName?: string) {
        const safeName = userName ? userName : email.split('@')[0];
        try {
            const today = new Date()

            await this.mailerService.sendMail({
                to: email, from: '"TOSKA" <no-reply@toska.com>',
                subject: `New Login Notification`,
                template: 'login', // Name of the file without extension
                context: {
                    // Data to be sent to the EJS file
                    userName: safeName,
                    email: email,
                    date: today.toDateString(),
                    time: today.toLocaleTimeString(),
                    year: today.getFullYear(),
                },
            });

        } catch (error) {
            console.log('Email Error:', error);
            throw new RequestTimeoutException('Failed to send email');
        }
    }

    public async sendVerifyEmailTemplate(email: string, link: string) {
        try {

            await this.mailerService.sendMail({
                to: email, from: '"TOSKA" <no-reply@toska.com>',
                subject: `Verify Email Notification`,
                template: 'verify-email', // Name of the file without extension
                context: {
                    // Data to be sent to the EJS file
                    userName: email.split('@')[0],
                    link,
                    year: new Date().getFullYear()
                },
            });

        } catch (error) {
            console.log('Email Error:', error);
            throw new RequestTimeoutException('Failed to send email');
        }
    }
    public async sendResetPasswordEmailTemplate(email: string, resetPasswordLink: string) {
        try {

            await this.mailerService.sendMail({
                to: email, from: '"TOSKA" <no-reply@toska.com>',
                subject: `Reset-Password Email Notification`,
                template: 'reset-password', // Name of the file without extension
                context: {
                    // Data to be sent to the EJS file
                    resetPasswordLink,
                    year: new Date().getFullYear()
                },
            });

        } catch (error) {
            console.log('Email Error:', error);
            throw new RequestTimeoutException('Failed to send email');
        }
    }

}