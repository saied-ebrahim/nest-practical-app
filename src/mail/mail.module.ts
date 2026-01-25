import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { join } from "node:path";
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
    providers: [MailService],
    exports: [MailService],
    imports: [MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
            return {
                transport: {
                    host: config.get<string>('SMTP_HOST'),
                    port: config.get<number>('SMTP_PORT'),
                    secure: false,
                    auth: {
                        user: config.get<string>('SMTP_USERNAME'),
                        pass: config.get<string>('SMTP_PASSWORD')
                    }

                }, defaults: {
                    from: '"TOSKA" <no-reply@yourapp.com>', // ALWAYS set a sender

                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter({
                        inlineCssEnabled: true
                    })
                }
            }
        },
    })]
})
export class MailModule {

}