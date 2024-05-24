import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class EmailDto {
  @ApiProperty({
    example: 'email',
  })
  @IsString()
  @IsNotEmpty({ message: 'user email is required' })
  to: string;

  @ApiProperty({
    example: 'subject',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email subject is required' })
  subject: string;

  @ApiProperty({
    example: 'body',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email body is required' })
  body: string;
}
export class EmailOperationDto {
  @ApiProperty({
    example: 'user uuid',
  })
  @IsString()
  @IsUUID('all', { message: 'user id must be valid uui-id' })
  @IsNotEmpty({ message: 'user id is required' })
  userId: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  isSuccess: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isAgreementFail: boolean;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  failedFilesCount: number;

  @ApiProperty({
    example: ['file1', 'file2'],
  })
  @IsArray()
  allFiles: string[];

  @ApiProperty({
    example: ['filename'],
  })
  @IsArray()
  failedFilesList: string[];

  @ApiProperty({
    example: 6,
  })
  @IsNumber()
  failedQuestionCount: number;

  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  successFilesCount: number;

  @ApiProperty({
    example: ['file1', 'file2'],
  })
  @IsArray()
  @IsOptional()
  successFilesList: string[];
}
