import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

// customer dto
export class CreateStripeDto {
  @ApiProperty({
    example: '',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

// Customer card dto
export class CardDto {
  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'customer id is required' })
  @IsString()
  customerId: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'card token is required' })
  @IsString()
  cardToken: string;
}
// Customer subscription dto
export class SubscriptionDto {
  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'customer id is required' })
  @IsString()
  customerId: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'plan id or price id is required' })
  @IsString()
  planId: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'source is required' })
  @IsString()
  source: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'plan name is required' })
  @IsString()
  planName: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'plan type is required' })
  @IsString()
  planType: string;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'Number of agreements is required' })
  @IsNumber()
  numberOfAgreements: number;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'Number of user defined questions is required' })
  @IsNumber()
  numberOfUserDefinedQuestions: number;

  @ApiProperty({
    example: '',
  })
  @IsNotEmpty({ message: 'user id is required' })
  @IsString()
  author: string;
}

export class CreateCardDto {
  @ApiProperty({
    example: '4242424242424242',
    name: 'cardNumber',
  })
  @IsString()
  @IsNotEmpty({ message: 'card number is required' })
  cardNumber: string;

  @ApiProperty({
    example: 8,
    name: 'exp_month',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'exp_month is required' })
  exp_month: number;

  @ApiProperty({ example: 2028, name: 'exp_year' })
  @IsNumber()
  @IsNotEmpty({ message: 'exp_year is required' })
  exp_year: number;

  @ApiProperty({
    example: '314',
    name: 'cvc',
  })
  @IsString()
  @IsNotEmpty({ message: 'cvc number is required' })
  cvc: string;
}

export class Product {
  @ApiProperty({
    example: '',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  price: number;

  @ApiProperty({
    example: '',
  })
  @IsString()
  quantity: number;
}

export class CreatePayment {
  @ApiProperty({
    isArray: true,
    type: Product,
  })
  @IsArray()
  products: Product[];

  @ApiProperty({
    example: 'usd',
    name: 'currency',
  })
  @IsString()
  @IsNotEmpty({ message: 'currency type is required' })
  currency: string;
}

export class ConsumedCounts {
  @ApiProperty({
    example: '',
    type: 'string',
  })
  @IsString()
  @IsUUID('all')
  planId: string;

  @ApiProperty({
    example: 0,
    type: 'number',
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
