import { AuthenticationProviders } from '@/common/constants/enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@/common/constants/enum';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Column } from 'typeorm';

export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  providerKey: string;

  @IsNotEmpty()
  @IsEnum(AuthenticationProviders)
  authenticationProvider: AuthenticationProviders;
}

export class socialLoginInputDTO {
  @ApiProperty({
    example: '',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: '',
  })
  @ValidateNested()
  @Type(() => SocialLoginDto)
  socialLogins: SocialLoginDto;

  // User role column
  // @ApiProperty({
  //   enum: UserRoles,
  // })
  // userRole: UserRoles;
}
