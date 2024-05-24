import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateGraphDto {
  @ApiProperty({
    example: 'string',
  })
  @IsString()
  graphPointsSummary: string;

  @ApiProperty({
    example: [{}],
  })
  @IsArray()
  graphPoints: any[];
}
