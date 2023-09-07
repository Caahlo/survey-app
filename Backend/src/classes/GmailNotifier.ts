import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import INotifier from '../interfaces/INotifier';

dotenv.config({ path: '../.env' });

class GmailNotifier implements INotifier {
  private mailTransporter: nodemailer.Transporter;

  constructor() {
    this.mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_SERVICE_ADDRESS,
        pass: process.env.MAIL_SERVICE_PASSWD,
      },
      secure: true,
    });
  }

  private async sendEmail(messageInfo: { recipient: string, subject: string, message: string }) {
    const mailDetails = {
      from: process.env.MAIL_SERVICE_ADDRESS,
      to: messageInfo.recipient,
      subject: messageInfo.subject,
      text: messageInfo.message,
    };

    return this.mailTransporter.sendMail(mailDetails);
  }

  async sendMessage(messageInfo: { recipient: string, subject: string, message: string }) {
    return this.sendEmail(messageInfo);
  }
}

export default GmailNotifier;
