import {
  Controller,
  Post,
  Body,
  HttpCode,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto, EmailVerificationDto, ResendOtpDto } from './dto/auth.dto';
import { CreateUserDto } from '@/auth/dto/create-user.dto';
import { socialLoginInputDTO } from './dto/socialLogin-input.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Controller('')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse()
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
  @ApiOperation({ summary: 'create user' })
  @Post('register')
  create(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Register user from social platform' })
  @Post('socialLogin')
  socialLogin(@Body() req: socialLoginInputDTO) {
    return this.authService.socialLogin(req);
  }

  @ApiOperation({ summary: 'Forget user password' })
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @ApiOperation({
    summary: 'Reset user password required email if otp is verified',
  })
  @Post('reset-password')
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
  })
  async resetPassword(
    @Query('email') email: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email, body.newPassword);
  }

  @Get('/logged-user/:email')
  async loggedInUser(@Param('email') email: string) {
    return await this.authService.loggedInUser(email);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Verify otp requires email & otp code' })
  @Post('verify-otp/')
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'otp',
    required: true,
    type: String,
  })
  async verifyOTP(@Query('email') email: string, @Query('otp') otp: string) {
    return await this.authService.verifyOTP(email, otp);
  }

  @ApiOperation({
    summary: 'Verify user account an otp requires email & otp code',
  })
  @Post('/verify-account')
  async verifyEmailOtp(@Body() body: EmailVerificationDto) {
    return await this.authService.verifyEmailOtp(body);
  }

  @ApiOperation({
    summary: 'Resend an otp requires email ',
  })
  @Post('/resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    const { email } = body;

    return await this.authService.resendOtp(email);
  }
}
