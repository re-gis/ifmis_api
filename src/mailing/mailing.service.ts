import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const OAuth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    OAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: any = await new Promise((resolve, reject) => {
      OAuth2Client.getAccessToken((error, token) => {
        if (error) {
          reject('Failed to create the access_token for gmt');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };

    this.mailService.addTransporter('gmail', config);
  }

  public async sendVerificationEmail(receiver: String) {
    await this.setTransport();
    this.mailService
      .sendMail({
        transporterName: 'gmail',
        to: receiver.toString(),
        from: this.configService.get('EMAIL'),
        subject: 'Rwanda Coding Academy user account verification',
        template: 'verify-acccount',
        context: {
          code: '38320',
        },
      })
      .then((result) => {
        console.log('mail sent successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
