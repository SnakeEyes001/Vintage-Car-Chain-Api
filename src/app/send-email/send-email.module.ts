import { Global, Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Global() // Utilisation de @Global() si SendEmailModule doit être global
@Module({
  imports: [
    //TypeOrmModule.forFeature([UserEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ghofrane.imran@gmail.com',
          pass: 'xsmtpsib-29f35cd438d51ab8dd780c805ac9091ef15abfb8c54fa48ff205e55e5dfdec36-kOXAjbtDcd4UyHIV',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, '/templates'), // Assurez-vous que le chemin des templates est correct
        adapter: new HandlebarsAdapter(), // Adapter pour Handlebars
        options: {
          strict: true,
        },
      },
    }),
    //UsersModule, // Import du module UsersModule
    //PasswordModule, // Import du module PasswordModule
  ],
  providers: [SendEmailService], // Fournisseur de SendEmailService
  exports: [SendEmailService], // Exportez SendEmailService si nécessaire
  controllers: [SendEmailController], // Contrôleur SendEmailController
})
export class SendEmailModule {}
