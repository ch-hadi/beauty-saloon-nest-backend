import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class updateProduct {
    @ApiProperty()
    @IsOptional()
    @IsString()
    productName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    productPrice?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    productDescription?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    categoryId?: string;
}