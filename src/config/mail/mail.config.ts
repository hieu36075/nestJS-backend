import { MailerOptions } from "@nestjs-modules/mailer";
import { createTransport } from "nodemailer";
export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'hieutcgcd191045@fpt.edu.vn',
      pass: '2D0D693C271D1B2EF1C4F59430C5FFE987A8',
    },
  },
  defaults: {
    from: 'hieutcgcd191045@fpt.edu.vn',
  },
};



