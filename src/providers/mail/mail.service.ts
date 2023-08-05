import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';

@Injectable()
export class MailService {
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    body: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      html: body,
    });
  }
}
