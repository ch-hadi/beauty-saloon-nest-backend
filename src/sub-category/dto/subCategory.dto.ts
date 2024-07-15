import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createSubCategoryDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subCategoryName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subCategoryDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:'Category ID is required.'})
    categoryId: any;

}