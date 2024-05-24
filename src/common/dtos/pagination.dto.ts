// pagination.dto.ts
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  readonly page: number = 1;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  readonly limit: number = 10;

  @IsOptional()
  @IsPositive()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsPositive()
  @IsString()
  readonly startDate?: string | Date;

  @IsOptional()
  @IsPositive()
  @IsString()
  readonly endDate?: string | Date;

  @IsOptional()
  @IsPositive()
  @IsString()
  readonly isCompleted?: boolean;
}
