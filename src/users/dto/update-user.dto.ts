import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
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
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsOptional()
  city?: string;
}
