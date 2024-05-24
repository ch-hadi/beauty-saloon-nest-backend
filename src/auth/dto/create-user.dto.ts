import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'last name is required' })
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
  @IsString()
  @MinLength(6, { message: 'password should be at least 6 characters long' })
  @MaxLength(50, {
    message: 'password should not be longer than 50 characters',
  })
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password too weak, password must contains one upper letter,number and a special character',
  })
  password: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  // @ApiProperty({
  //   example: UserRoles.USER,
  //   default: UserRoles.USER,
  // })
  // @IsString()
  // userRole: UserRoles;

  // User's subscriptions type
  // @ApiProperty({
  //   example: SubscriptionType.FREE,
  //   enum: SubscriptionType,
  //   default: SubscriptionType.FREE,
  // })
  // @IsOptional()
  // @IsString()
  // subscriptionType?: SubscriptionType;
}
