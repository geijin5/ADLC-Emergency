import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Alert } from '../alerts/entities/alert.entity';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import * as twilio from 'twilio';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // Initialize email transporter
    const smtpHost = this.configService.get('SMTP_HOST');
    if (smtpHost) {
      this.emailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: this.configService.get('SMTP_PORT', 587),
        secure: false,
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    }

    // Initialize Twilio client
    const twilioSid = this.configService.get('TWILIO_ACCOUNT_SID');
    if (twilioSid) {
      this.twilioClient = twilio(
        twilioSid,
        this.configService.get('TWILIO_AUTH_TOKEN'),
      );
    }
  }

  async sendAlertNotifications(alert: Alert): Promise<void> {
    try {
      if (alert.target === 'public' || alert.target === 'both') {
        // Send public notifications (push notifications handled by frontend)
        this.logger.log(`Sending public alert: ${alert.title}`);
      }

      if (alert.target === 'personnel' || alert.target === 'both') {
        // Send to all active personnel
        const users = await this.usersService.findAll();
        for (const user of users.filter((u) => u.isActive)) {
          await this.sendToUser(user.id, alert, 'email');
          if (user.phoneNumber) {
            await this.sendToUser(user.id, alert, 'sms');
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error sending alert notifications: ${error.message}`);
    }
  }

  async sendToUser(userId: string, alert: Alert, method: 'email' | 'sms'): Promise<void> {
    const user = await this.usersService.findOne(userId);
    
    if (method === 'email' && user.email && this.emailTransporter) {
      try {
        await this.emailTransporter.sendMail({
          from: this.configService.get('SMTP_USER'),
          to: user.email,
          subject: `ADLC Emergency Alert: ${alert.title}`,
          text: alert.message,
          html: `<h2>${alert.title}</h2><p>${alert.message}</p>`,
        });
      } catch (error) {
        this.logger.error(`Error sending email to ${user.email}: ${error.message}`);
      }
    }

    if (method === 'sms' && user.phoneNumber && this.twilioClient) {
      try {
        await this.twilioClient.messages.create({
          body: `ADLC Alert: ${alert.title} - ${alert.message.substring(0, 100)}...`,
          from: this.configService.get('TWILIO_PHONE_NUMBER'),
          to: user.phoneNumber,
        });
      } catch (error) {
        this.logger.error(`Error sending SMS to ${user.phoneNumber}: ${error.message}`);
      }
    }
  }

  async sendMassCallout(userIds: string[], message: string, method: 'email' | 'sms' | 'push'): Promise<void> {
    for (const userId of userIds) {
      await this.sendToUser(userId, { message } as Alert, method);
    }
  }
}

