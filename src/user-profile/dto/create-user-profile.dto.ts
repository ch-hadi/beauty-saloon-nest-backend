import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserProfileDto {
  // @ApiProperty({
  //   example: 'user uuid',
  // })
  // @IsString()
  // @IsUUID('all', { message: 'userid must be valid id' })
  // @IsNotEmpty({ message: 'userid is required' })
  // userId: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'firstname is required' })
  firstName: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'phonenumber is required' })
  phoneNumber: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'avatar is required' })
  avatar: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'date of birth is required' })
  birthDate: Date | string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'country is required' })
  country: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'state is required' })
  state: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  city: string;
}
