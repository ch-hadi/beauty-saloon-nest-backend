import { PartialType } from '@nestjs/swagger';
import { CreateStripeDto } from './stripe.dto';

export class UpdateStripeDto extends PartialType(CreateStripeDto) {}
