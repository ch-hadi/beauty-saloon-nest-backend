import { UsersService } from '@/users/users.service';
import { Injectable, HttpException, HttpStatus, Global } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, EmailVerificationDto } from './dto/auth.dto';
import { helper } from '@/helper';
import { JwtPayload } from './interface/Jwt.interface';
import { CreateUserDto } from './dto/create-user.dto';
import {
  FORBIDDEN_RESPONSE,
  INVALID_OTP,
} from '@/common/constants/http-responses.types';
import { socialLoginInputDTO } from './dto/socialLogin-input.dto';
import { EmailService } from '@/email/email.service';

@Injectable()
@Global()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(body: CreateUserDto): Promise<object> {
    const user = await this.usersService.create(body);
    const { password, otpCode, ...rest } = user;
    const jwt_token = await this.createAccessToken(rest);
    return { ...rest, access_token: jwt_token };
  }

  async login(body: AuthDto): Promise<unknown> {
    const user = await this.usersService.getByUserByEmail(body.email);

    if (!user)
      throw new HttpException('Invalid email/password', HttpStatus.NOT_FOUND);

    const verifyPassword = await helper.comparePassword(
      body.password,
      user.password,
    );

    if (!verifyPassword)
      throw new HttpException('Invalid email/password', HttpStatus.NOT_FOUND);

    if (user?.isActive === false)
      throw new HttpException(
        FORBIDDEN_RESPONSE.message,
        FORBIDDEN_RESPONSE.status,
      );

    const { userProfile } = user;
    const { password, ...rest } = user;

    const jwt_token = await this.createAccessToken({
      id: user.id,
      email: user.email,
      userRole: user.userRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const {
      id,
      email,
      isActive,
      userRole,
      subscriptionType,
      stripeCustomerId,
      emailVerified,
      otpCode,
      loginCount,
      createdAt,
      updatedAt,
    } = rest;
    return {
      status: HttpStatus.OK,
      data: {
        id,
        email: email,
        isActive: isActive,
        userRole: userRole,
        stripeCustomerId,
        emailVerified,
        otpCode,
        loginCount,
        subscriptionType,
        avatar: userProfile?.avatar || '',
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        phoneNumber: userProfile?.phoneNumber || '',
        createdAt,
        updatedAt,
        access_token: jwt_token,
      },
    };
  }

  async socialLogin(body: socialLoginInputDTO) {
    const user = await this.usersService.createUserSocialLogin(body);
    const jwt_token = await this.createAccessToken({
      id: user.id,
      email: user.email,
      userRole: user.userRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return {
      status: HttpStatus.OK,
      data: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
        userRole: user.userRole,
        stripeCustomerId: user.stripeCustomerId,
        subscriptionType: user.subscriptionType,
        avatar: user.userProfile?.avatar || '',
        firstName: user.userProfile?.firstName || '',
        lastName: user.userProfile?.lastName || '',
        phoneNumber: user.userProfile?.phoneNumber || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        access_token: jwt_token,
      },
    };
  }

  // Send reset password email
  async sendPasswordResetEmail(email: string) {
    const otp = helper.generateOTP();
    await this.usersService.addOPT(email, otp);
    return { data: [], message: 'otp code sent to your email' };
  }

  async resetPassword(email: string, newPassword: string) {
    return this.usersService.resetPassword(email, newPassword);
  }

  async verifyOTP(email: string, otp: string) {
    const user = await this.usersService.getByUserByEmail(email);
    if (!user || user.otpCode !== otp) {
      throw new HttpException(INVALID_OTP.message, INVALID_OTP.status);
    }
    return {
      data: [],
      message: 'otp verified successfully',
      status: 200,
    };
  }

  async verifyEmailOtp(body: EmailVerificationDto) {
    const { email, otp } = body;
    return await this.usersService.verifyEmailOtp(email, otp);
  }

  async resendOtp(email: string) {
    return await this.usersService.resendOTPCode(email);
  }

  async loggedInUser(email: string) {
    const user = await this.usersService.getByUserByEmail(email);
    return user;
  }

  public async createAccessToken(payload: JwtPayload): Promise<unknown> {
    const result = this.jwtService.sign(payload, {
      secret: process.env.JWT_KEY,
    });

    return result;
  }
}
