import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SubscriptionDto } from './stripe.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// why dtos are in snake-case ?
export class UpdateSubscriptionDto extends PartialType(SubscriptionDto) {
  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'Existing subscription id is required' })
  @IsString()
  existing_subscription_id: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'additional question required' })
  @IsNumber()
  additional_questions: number;
}
