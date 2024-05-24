import { Users } from '@/users/entities/user.entity';
import { Global, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as SendGrid from '@sendgrid/mail';
import { Repository } from 'typeorm';
import { EmailDto, EmailOperationDto } from './dto/email.dto';
import {
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  USER_NOT_FOUND_RESPONSE,
} from '@/common/constants/http-responses.types';
import { IsPlanActiveType } from '@/common/constants/enum';
import { UserSubscription } from '@/stripe/entities/stripe.entity';

@Global()
@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepo: Repository<UserSubscription>,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  private createMailConfig(to: string, subject: string, body: string) {
    const senderEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    const senderName = this.configService.get<string>('SENDGRID_FROM_NAME');

    return {
      to: to,
      subject: subject,
      from: {
        email: senderEmail,
        name: senderName || 'unknown',
      },
      html: body,
    };
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);

    return transport;
  }

  async sendBatchMail(body: EmailOperationDto) {
    const {
      userId,
      isSuccess,
      isAgreementFail,
      failedFilesCount,
      failedQuestionCount,
      failedFilesList,
      allFiles,
    } = body;

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: {
        userProfile: true,
      },
    });

    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }

    const subject = 'Agreements Analysis';
    const to = user?.email;

    const successMailContent = `
    <p>Dear ${user?.userProfile?.firstName} ${user?.userProfile?.lastName},</p>
    <p>We are pleased to inform you that your <b>Batch operation</b> has been successfully analyzed.</p>
    <p>To view the results of the analysis, please click on the following link:</p>
    <p><a target="_blank" href="https://app.zealdrivensolutions.ai/user/batches">View Template Analysis Results</a></p>
    <p>Thank you for using our services!</p>
    <p>This is an automated email response. Please do not reply.</p>
    `;

    const failedMailContent = `
    <p>Dear ${user?.userProfile?.firstName} ${user?.userProfile?.lastName},</p>
    <p>We sorry to inform you that your <b>Batch operation</b> has failed.</p>
    <p>Please try again if the issue persist then contact our technical team.</p>
    <p>Thank you for using our services!</p>
    <p>This is an automated email response. Please do not reply.</p>
    `;
    if (isAgreementFail) {
      const userSubscription = await this.userSubscriptionRepo.findOne({
        where: {
          isActive: IsPlanActiveType.ACTIVE,
          author: { id: userId },
        },
      });

      if (!userSubscription)
        throw new HttpException(
          'User subscription not found',
          NOT_FOUND_RESPONSE.status,
        );

      if (
        Number(failedFilesCount) > Number(userSubscription.usedContracts) &&
        Number(userSubscription.usedContracts) === 0
      )
        throw new HttpException(
          `${BAD_REQUEST_RESPONSE.message}: filed agreements value count is lager than consumed Contracts.`,
          BAD_REQUEST_RESPONSE.status,
        );

      if (
        Number(failedQuestionCount) >
          Number(userSubscription.consumeUserDefinedQuestion) &&
        Number(userSubscription.consumeUserDefinedQuestion) === 0
      )
        throw new HttpException(
          `${BAD_REQUEST_RESPONSE.message}: filed questions value count is lager than consumed questions.`,
          BAD_REQUEST_RESPONSE.status,
        );

      userSubscription.usedContracts =
        userSubscription.usedContracts - failedFilesCount;
      userSubscription.consumeUserDefinedQuestion =
        userSubscription.consumeUserDefinedQuestion - failedQuestionCount;
      await this.userSubscriptionRepo.save(userSubscription);

      const email_template = `
      <p>Dear ${user?.userProfile?.firstName} ${
        user?.userProfile?.lastName
      },</p>
      <p>We are pleased to inform you that your <b>Batch operation</b> has been successfully analyzed.</p>
      <p>To view the results of the analysis, please click on the following link:</p>
      <p><a href="https://app.zealdrivensolutions.ai/admin/view/batch">View Template Analysis Results</a></p>
      <p>Number of files analyzed: ${allFiles?.length}</p>
      <p>Number of files failed to analyze: ${failedFilesCount}</p>
      ${
        failedFilesCount > 0
          ? `
      <p>Failed files:</p>
      <ul>
      ${failedFilesList.map((file) => `<li>${file}</li>`).join('')}
      </ul>`
          : ''
      }
      <p>Thank you for using our services!</p>
      <p>This is an automated email response. Please do not reply.</p>
      `;

      const mail = this.createMailConfig(to, subject, email_template);
      const transport = await this.send(mail);
      return transport;
    }

    const mailContent = isSuccess ? successMailContent : failedMailContent;

    const mail = this.createMailConfig(to, subject, mailContent);
    const transport = await this.send(mail);
    return transport;
  }

  async sendMail(body: EmailDto) {
    const { to, body: payload, subject } = body;
    const mail = this.createMailConfig(
      to,
      subject || 'Xanthica',
      payload || '<p>nobody...</p>',
    );
    const transport = await this.send(mail);
    return transport;
  }

  // Send mail for reset password
  async sendResetPasswordOTP(email: string, otp: string, firstName: string) {
    const mailContent = otp
      ? `<p>${firstName} your otp verification code is: ${otp}</p>`
      : '<p>nobody...</p>';

    const mail = this.createMailConfig(
      email,
      'Forgot Password Request',
      mailContent,
    );
    const transport = await this.send(mail);
    return transport;
  }
  async sendRegistrationOTP(email: string, otp: string, name: string) {
    const mailContent = otp
      ? `<p>Hi ${name}, <br/>This is your account verification code: <strong>${otp}</strong></p>`
      : '';

    const mail = this.createMailConfig(
      email,
      'ZDS Account Verification Code',
      mailContent,
    );
    const transport = await this.send(mail);
    return transport;
  }
}
