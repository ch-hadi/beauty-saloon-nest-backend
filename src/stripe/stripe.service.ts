import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CardDto,
  ConsumedCounts,
  CreateCardDto,
  CreatePayment,
  CreateStripeDto,
  SubscriptionDto,
} from './dto/stripe.dto';
import { DataSource, Repository } from 'typeorm';
import Stripe from 'stripe';
import { helper } from '@/helper';
import stripeConfig from '../config/stripe.config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from './entities/stripe.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Users } from '@/users/entities/user.entity';
import { IsPlanActiveType, SubscriptionType } from '@/common/constants/enum';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '@/common/constants/http-responses.types';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    // @InjectRepository(Agreements)
    // private readonly agreementRepository: Repository<Agreements>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(stripeConfig.stripeSecretKey, {
      apiVersion: this.configService.get<any>('STRIPE_API_VERSION'),
    });
  }

  async createCustomer(body: CreateStripeDto): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create(body);
      return customer;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCustomers() {
    const result = await this.stripe.customers.list();

    return result;
  }

  async addCustomerCard(
    body: CardDto,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    try {
      const { cardToken, customerId } = body;
      await this.stripe.customers.createSource(customerId, {
        source: cardToken,
      });

      const customer = await this.stripe.customers.retrieve(customerId);
      return customer;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createPaymentMethod(payload: CreateCardDto) {
    try {
      const createCard = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: payload.cardNumber,
          exp_month: payload.exp_month,
          exp_year: payload.exp_year,
          cvc: payload.cvc,
        },
      });
      return createCard;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async subscribeToPlan(body: SubscriptionDto): Promise<UserSubscription> {
    try {
      const { author, planType, planId, customerId } = body;
      const subscription: Stripe.Response<Stripe.Subscription> =
        await this.stripe.subscriptions.create({
          customer: customerId,
          items: [{ plan: planId }],
        });

      const userSubscriptionData = await this.updateUserSubscription(
        subscription,
        body.numberOfAgreements,
        body.numberOfUserDefinedQuestions,
        author,
        planType,
      );

      return userSubscriptionData;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async allProducts(limit: number): Promise<Stripe.ApiList<Stripe.Product>> {
    try {
      const products = await this.stripe.products.list({
        limit: limit || 10,
        expand: ['data.price'],
        active: true,
      });
      return products;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async allProductsPrices(
    limit: number,
  ): Promise<Stripe.ApiList<Stripe.Price>> {
    try {
      const products = await this.stripe.prices.list({
        limit: limit || 10,
        expand: ['data.product'],
        active: true,
      });
      return products;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async productByIdPrices(id: string): Promise<Stripe.Price> {
    try {
      const price: Stripe.Price = await this.stripe.prices.retrieve(id);
      return price;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPayment(paymentRequestBody: CreatePayment): Promise<any> {
    let sumAmount = 0;
    paymentRequestBody.products.forEach((product) => {
      sumAmount = sumAmount + product.price * product.quantity;
    });

    return this.stripe.paymentIntents.create({
      amount: sumAmount * 100,
      currency: paymentRequestBody.currency,
    });
  }

  //why subscription type is any?
  async createUserSubscription(
    subscription: any,
    totalContracts: number,
    totalUserDefinedQuestion: number,
    author: string,
    plan: string,
  ): Promise<UserSubscription> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const userSubscription = queryRunner.manager.create(UserSubscription, {
        startDate: helper.convertIntoUTCTime(subscription.current_period_start),
        expiryDate: helper.convertIntoUTCTime(subscription.current_period_end),
        totalContracts,
        totalUserDefinedQuestion,
        author: { id: author },
        plan,
      });
      const result = await queryRunner.manager.save(userSubscription);
      await queryRunner.commitTransaction();
      return result;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserSubscription(
    subscription: {
      id?: string;
      current_period_start: number;
      current_period_end: number;
    },
    totalContracts: number,
    totalUserDefinedQuestion: number,
    authorId: string,
    planType: string,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    const isPlan = await this.userSubscriptionRepository.findOne({
      where: {
        author: {
          id: authorId,
        },
        isActive: IsPlanActiveType.ACTIVE,
      },
    });

    await queryRunner.startTransaction();
    try {
      const startDate = helper.convertIntoUTCTime(
        subscription.current_period_start,
      );
      const endDate = helper.convertIntoUTCTime(
        subscription.current_period_end,
      );

      if (!isPlan) {
        const userSubscription = queryRunner.manager.create(UserSubscription, {
          startDate: startDate,
          expiryDate: endDate,
          totalContracts,
          totalUserDefinedQuestion,
          author: { id: authorId },
          subscriptionId: subscription.id,
          plan: planType,
        });

        await queryRunner.manager.update(Users, authorId, {
          subscriptionType: SubscriptionType.PAID,
        });

        const result = await queryRunner.manager.save(userSubscription);
        await queryRunner.commitTransaction();
        return result;
      }

      const updateSubs = queryRunner.manager.merge(UserSubscription, isPlan, {
        isActive: IsPlanActiveType.INACTIVE,
      });

      await queryRunner.manager.save(updateSubs);

      const newSub = queryRunner.manager.create(UserSubscription, {
        startDate: startDate,
        expiryDate: endDate,
        usedContracts: isPlan.usedContracts,
        subscriptionId: subscription.id,
        consumeUserDefinedQuestion: isPlan.consumeUserDefinedQuestion,
        totalContracts: +isPlan.totalContracts + totalContracts,
        totalUserDefinedQuestion:
          +isPlan.totalUserDefinedQuestion + totalUserDefinedQuestion,
        author: { id: authorId },
        plan: planType,
      });
      const result = await queryRunner.manager.save(newSub);

      await queryRunner.commitTransaction();
      return result;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err?.response?.body?.errors[0]?.message || err.message,
        err.status || INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async purchaseOneTimePlan(body: SubscriptionDto): Promise<unknown> {
    try {
      const { author, planType } = body;
      const charge: Stripe.Response<Stripe.Charge> = await this.chargePayment(
        body,
      );

      const today = new Date();
      const expiryDate = today.setFullYear(today.getFullYear() + 1);
      const expiryDateString: any = expiryDate
        .toString()
        .slice(0, 10)
        .replace(/-/g, '');

      const subscription = {
        current_period_start: charge.created,
        current_period_end: expiryDateString,
      };
      const userSubscriptionData = await this.updateUserSubscription(
        subscription,
        body.numberOfAgreements,
        body.numberOfUserDefinedQuestions,
        author,
        planType,
      );
      return userSubscriptionData;
    } catch (error: unknown | any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        error.status | HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async purchaseAdditionalQuestions(body: UpdateSubscriptionDto) {
    const charge = await this.chargePayment(body);

    await this.userSubscriptionRepository
      .createQueryBuilder()
      .update(UserSubscription)
      .set({
        totalUserDefinedQuestion: () =>
          `totalUserDefinedQuestion + ${body.additional_questions}`,
      })
      .where({ id: body.existing_subscription_id })
      .execute();
    return charge;
  }

  // why body types are not defined?
  async chargePayment(body) {
    return await this.stripe.charges.create({
      customer: body.customerId,
      amount: body.price * 100,
      currency: this.configService.get<any>('STRIPE_CURRENCY'),
      source: body.source,
    });
  }

  async constructEventFromPayload(
    signature: string | string[],
    payload: Buffer,
  ) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    const event: Stripe.Event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
    return event;
  }

  async updatePlanStatusByCustomerId(id: string, subId: string) {
    const isPlan = await this.userSubscriptionRepository.findOneOrFail({
      where: {
        author: {
          stripeCustomerId: id,
        },
        subscriptionId: subId,
        isActive: IsPlanActiveType.ACTIVE,
      },
    });

    await this.userSubscriptionRepository.update(isPlan.id, {
      isActive: IsPlanActiveType.INACTIVE,
    });
  }

  async addPlanConsumedCounts(payload: ConsumedCounts) {
    const { planId, quantity } = payload;
    const isPlan = await this.userSubscriptionRepository.findOneOrFail({
      where: {
        id: planId,
        isActive: IsPlanActiveType.ACTIVE,
      },
    });

    if (!isPlan) {
      throw new NotFoundException('Plan not found');
    }

    await this.userSubscriptionRepository.update(isPlan.id, {
      consumedCounts: quantity,
    });
    return {
      message: 'Record updated successfully',
      data: [],
    };
  }
}
