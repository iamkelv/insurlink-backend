import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
    this.fromEmail = this.config.getOrThrow<string>('RESEND_FROM_EMAIL');
    console.log('Email service initialized', {
      apiKey: this.config.getOrThrow<string>('RESEND_API_KEY'),
      fromEmail: this.config.getOrThrow<string>('RESEND_FROM_EMAIL'),
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    console.log('Sending email to', to);
    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email', error);
      throw error;
    }
    console.log('Email sent successfully', {
      to,
      subject,
      id: (data as any)?.id,
    });
  }
}
