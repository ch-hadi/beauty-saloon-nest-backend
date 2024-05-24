import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import {
  CardDto,
  CreateCardDto,
  CreateStripeDto,
  SubscriptionDto,
  CreatePayment,
  ConsumedCounts,
} from './dto/stripe.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('Stripe services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/create-customer')
  create(@Body() body: CreateStripeDto) {
    return this.stripeService.createCustomer(body);
  }

  @Get('/customers')
  customers() {
    return this.stripeService.getAllCustomers();
  }

  @Post('add-payment-method')
  setDefaultCard(@Body() body: CreateCardDto) {
    const result = this.stripeService.createPaymentMethod(body);
    return result;
  }

  @Post('/link-card')
  createCard(@Body() body: CardDto) {
    return this.stripeService.addCustomerCard(body);
  }

  @Post('subscribe')
  async subscribeToPlan(@Body() body: SubscriptionDto) {
    if (body.planType === 'OneTime') {
      return await this.stripeService.purchaseOneTimePlan(body);
    } else {
      return await this.stripeService.subscribeToPlan(body);
    }
  }

  @Post('purchase/additional_questions')
  async purchaseAdditionalQuestions(@Body() body: UpdateSubscriptionDto) {
    return await this.stripeService.purchaseAdditionalQuestions(body);
  }

  @Get('/products')
  products(@Query('limit') limit: number) {
    return this.stripeService.allProducts(limit);
  }
  @Get('/products-prices')
  productPrices(@Query('limit') limit: number) {
    return this.stripeService.allProductsPrices(limit);
  }
  @Get('/:price_id/prices')
  productPricesById(
    @Param('price_id')
    prodId: string,
  ) {
    return this.stripeService.productByIdPrices(prodId);
  }

  @Post('/payment')
  createPayments(@Body() paymentRequestBody: CreatePayment) {
    return this.stripeService.createPayment(paymentRequestBody);
  }

  @Put('/update-consumed-counts')
  @HttpCode(200)
  addPlanConsumedCounts(@Body() body: ConsumedCounts) {
    return this.stripeService.addPlanConsumedCounts(body);
  }
}
