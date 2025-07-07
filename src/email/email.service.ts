import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    const transportConfig: any = {
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465, // true for 465, false for other ports
    };

    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');

    if (emailUser && emailPass) {
      transportConfig.auth = {
        user: emailUser,
        pass: emailPass,
      };
    }

    this.transporter = nodemailer.createTransport(transportConfig);
  }

  private async readTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'dist',
      'email',
      'templates',
      `${templateName}.html`,
    );
    return fs.readFile(templatePath, 'utf-8');
  }

  private replacePlaceholders(
    template: string,
    placeholders: Record<string, string>,
  ): string {
    let processedTemplate = template;
    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    }
    return processedTemplate;
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendTwoFactorAuthEmail(
    to: string,
    name: string,
    code: string,
  ): Promise<void> {
    const template = await this.readTemplate('two-factor-auth');
    const html = this.replacePlaceholders(template, {
      name: name || 'Usuário',
      code,
    });
    const text = `Your Two-Factor Authentication Code is: ${code}`;

    await this.sendMail(to, 'Two-Factor Authentication Code', text, html);
  }

  async sendTwoFactorEnableEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const url = `${this.configService.get<string>(
      'APP_URL',
    )}/auth/2fa/enable?token=${token}`;
    const template = await this.readTemplate('two-factor-auth-enable');
    const html = this.replacePlaceholders(template, {
      name: name || 'Usuário',
      url,
    });
    const text = `Click the link to enable Two-Factor Authentication: ${url}`;

    await this.sendMail(to, 'Enable Two-Factor Authentication', text, html);
  }
}
