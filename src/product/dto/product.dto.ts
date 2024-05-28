import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createProductDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productPrice: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message:'Category ID is required.'})
  categoryId: string;
}
