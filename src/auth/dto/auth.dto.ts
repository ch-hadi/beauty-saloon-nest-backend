import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: '',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @MinLength(3, { message: 'password should be at least 3 characters long' })
  @MaxLength(50, {
    message: 'password should not be longer than 50 characters',
  })
  password: string;
}

export class EmailVerificationDto {
  @ApiProperty({
    example: '',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  // @MinLength({ message: 'opt should be at least 3 characters long' })
  otp: string;
}

export class ResendOtpDto {
  @ApiProperty({
    example: '',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
