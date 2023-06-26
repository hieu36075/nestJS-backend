import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/config/mail/mail.config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers:[MailService],
  exports: [MailService],
})
export class MailModule {}