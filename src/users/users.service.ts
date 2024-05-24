import { UserObj } from './../common/constants/query-response.types';
import { HttpException, Injectable, Global, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, ILike, Not, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import {
  BAD_REQUEST_RESPONSE,
  EMAIL_ALREADY_EXIST_RESPONSE,
  FORBIDDEN_RESPONSE,
  INVALID_OTP,
  USER_NOT_FOUND_RESPONSE,
  EXPIRY_TIME_HAS_PASSED,
  ACCOUNT_ALREADY_VERIFIED,
  ACCOUNT_VERIFIED,
} from '@/common/constants/http-responses.types';
import { socialLoginInputDTO } from '@/auth/dto/socialLogin-input.dto';
import { IsPlanActiveType, UserRoles } from '@/common/constants/enum';
import { SocialLogins } from './entities/socialLogin.entity';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { helper } from '@/helper';
import { StripeService } from '@/stripe/stripe.service';
import { UserProfile } from '@/user-profile/entities/user-profile.entity';
import { UserSubscription } from '@/stripe/entities/stripe.entity';
import { EmailService } from '@/email/email.service';
@Global()
@Injectable()
export class UsersService {
  constructor(
    private readonly stripService: StripeService,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(SocialLogins)
    private readonly socialLoginsRepo: Repository<SocialLogins>,
    private readonly dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  async create(body: CreateUserDto) {
    const { email, password, ...rest } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    const isUser = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });

    if (isUser)
      throw new HttpException(
        EMAIL_ALREADY_EXIST_RESPONSE.message,
        EMAIL_ALREADY_EXIST_RESPONSE.status,
      );

    await queryRunner.startTransaction();
    try {
      // Create a customer on stripe as well
      const stripeCustomer = await this.stripService.createCustomer({
        email: body.email,
        name: body.firstName + body.lastName,
      });

      const otp = helper.generateOTP();

      const expiryTime = helper.generateExpiryTime();
      const user = queryRunner.manager.create(Users, {
        email: email,
        password: password,
        userRole: UserRoles.USER,
        otpCode: otp,
        emailVerified: false,
        stripeCustomerId: stripeCustomer.id,
        OtpExpiryTime: expiryTime,
      });

      const saveOne = await queryRunner.manager.save(user);

      const userProfile = queryRunner.manager.create(UserProfile, {
        ...rest,
        user: saveOne,
      });

      const profile = await queryRunner.manager.save(userProfile);

      const { avatar, firstName, lastName, phoneNumber } = profile;

      await this.emailService.sendRegistrationOTP(
        email,
        otp,
        userProfile?.fullName,
      );

      await queryRunner.commitTransaction();
      return { ...saveOne, avatar, firstName, lastName, phoneNumber };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async me(req: any) {
    const userId = req?.user?.id;
    const user = await this.userRepo.findOneOrFail({
      where: {
        id: userId,
      },
      select: {
        ...UserObj,
      },
      relations: {
        userProfile: true,
        subscriptions: true,
        socialLogin: true,
      },
    });

    return user;
  }

  async findOne(userId: string) {
    const user = await this.userRepo.findOneOrFail({
      where: {
        id: userId,
      },
      select: {
        ...UserObj,
      },
      relations: {
        userProfile: true,
        subscriptions: true,
        socialLogin: true,
      },
    });

    if (!user)
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    const { subscriptions, ...rest } = user;
    const subscription = subscriptions?.find(
      (item: UserSubscription) => item.isActive === IsPlanActiveType.ACTIVE,
    );

    return { ...rest, subscription };
  }

  async getUserPlan(user: Users) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { id } = user;

    await queryRunner.connect();
    try {
      const plan = await queryRunner.manager.findOne(UserSubscription, {
        where: {
          author: {
            id: id,
          },
          isActive: IsPlanActiveType.ACTIVE,
        },
      });
      return plan;
    } catch (error: any) {
      await queryRunner.release();
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // get all users
  async getUserList() {
    const user = await this.userRepo.find({
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
    return user;
  }

  async getByUserByEmail(email: string): Promise<Users> {
    const isUser = await this.userRepo.findOne({
      where: {
        email: email,
      },
      relations: {
        subscriptions: true,
        userProfile: true,
      },
      order: {
        subscriptions: {
          createdAt: 'DESC',
        },
      },
    });
    return isUser;
  }

  async verifyEmailOtp(email: string, otp: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    if (user.emailVerified) {
      throw new HttpException(
        ACCOUNT_ALREADY_VERIFIED.message,
        ACCOUNT_ALREADY_VERIFIED.status,
      );
    }
    const difference = helper.getTimeDifferenceInMinutes(user.OtpExpiryTime);
    if (user.otpCode !== otp) {
      throw new HttpException(INVALID_OTP.message, INVALID_OTP.status);
    }
    if (difference) {
      await this.userRepo.update(user.id, {
        emailVerified: true,
        otpCode: '',
        OtpExpiryTime: null,
      });
      return {
        data: [],
        message: ACCOUNT_VERIFIED.message,
        status: ACCOUNT_VERIFIED.status,
      };
    }
    if (!difference) {
      throw new HttpException(INVALID_OTP.message, INVALID_OTP.status);
    }

    await this.userRepo.update(user.id, {
      emailVerified: true,
      otpCode: '',
      OtpExpiryTime: '',
    });

    return {
      data: [],
      message: 'Account verified successfully',
      status: 200,
    };
  }

  async createUserSocialLogin(dTO: socialLoginInputDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { email, socialLogins, firstName, lastName } = dTO;

    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
      relations: {
        userProfile: true,
        socialLogin: true,
        subscriptions: true,
      },
      select: {
        ...UserObj,
      },
    });

    if (!user) {
      await queryRunner.startTransaction();
      try {
        const stripeCustomer = await this.stripService.createCustomer({
          email: email,
          name: firstName + ' ' + lastName,
        });

        const user = queryRunner.manager.create(Users, {
          email: email,
          password: null,
          userRole: UserRoles.USER,
          stripeCustomerId: stripeCustomer.id,
        });
        const saveUser = await queryRunner.manager.save(user);

        const userProfile = queryRunner.manager.create(UserProfile, {
          firstName,
          lastName,
          user: saveUser,
        });

        await queryRunner.manager.save(userProfile);

        const socialLogin = queryRunner.manager.create(SocialLogins, {
          AuthenticationProvider: socialLogins.authenticationProvider,
          ProviderKey: socialLogins.providerKey,
          user: saveUser,
        });

        await queryRunner.manager.save(socialLogin);
        await queryRunner.commitTransaction();
        const newUser = await this.userRepo.findOne({
          where: {
            email: email,
          },
          relations: {
            userProfile: true,
            socialLogin: true,
            subscriptions: true,
          },
          select: {
            ...UserObj,
          },
        });
        return newUser;
      } catch (error: any) {
        await queryRunner.rollbackTransaction();
        throw new HttpException(
          error?.response?.body?.errors[0]?.message || error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        await queryRunner.release();
      }
    }
    return user;
  }

  /**
   *
   * @param id
   * @returns
   */
  async activeOrInactiveUser(id: string) {
    const user = await this.userRepo.findOneBy({
      id: id,
    });

    if (!user)
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );

    const update_user = this.userRepo.merge(user, {
      isActive: !user.isActive,
    });

    return await this.userRepo.save(update_user);
  }

  // Update/Reset password
  async updateUserPassword(email: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user)
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );

    const updatePwd = this.userRepo.merge(user, {
      password: newPassword,
    });

    const updatedUser = await this.userRepo.save(updatePwd);

    return updatedUser;
  }

  // reset password by otp
  async resetPassword(email: string, newPassword: string) {
    // Reset the user's password
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }

    if (!user.otpCode) {
      throw new HttpException(
        BAD_REQUEST_RESPONSE.message,
        BAD_REQUEST_RESPONSE.status,
      );
    }
    const hashedNewPass = await helper.hashPassword(newPassword);
    const updatePwd = this.userRepo.merge(user, {
      password: hashedNewPass,
      otpCode: null,
    });
    return await this.userRepo.save(updatePwd);
  }

  // add OTP code in user entity
  async addOPT(email: string, otp: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
      relations: {
        userProfile: true,
      },
    });

    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }

    await queryRunner.startTransaction();
    try {
      const addOtp = queryRunner.manager.merge(Users, user, {
        otpCode: otp,
      });

      const updatedUser = await queryRunner.manager.save(addOtp);

      await this.emailService.sendResetPasswordOTP(
        email,
        otp,
        updatedUser?.userProfile?.firstName,
      );

      await queryRunner.commitTransaction();
      return addOtp;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // resend otp code
  async resendOTPCode(email: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
      relations: {
        userProfile: true,
      },
    });
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    if (user.emailVerified) {
      throw new HttpException(
        ACCOUNT_ALREADY_VERIFIED.message,
        ACCOUNT_ALREADY_VERIFIED.status,
      );
    }
    await queryRunner.startTransaction();
    try {
      const otp = helper.generateOTP();
      const expiryTime = helper.generateExpiryTime();
      const addOtp = queryRunner.manager.merge(Users, user, {
        otpCode: otp,
        OtpExpiryTime: expiryTime,
      });

      const updatedUser = await queryRunner.manager.save(addOtp);
      // console.log('first', updatedUser);
      await this.emailService.sendRegistrationOTP(
        email,
        otp,
        updatedUser?.userProfile?.fullName,
      );
      // const updatedData = await this.userRepo.findOne({
      //   where: {
      //     email: email,
      //   },
      //   relations: {
      //     userProfile: true,
      //   },
      // });
      await queryRunner.commitTransaction();
      return { OtpExpiryTime: updatedUser?.OtpExpiryTime };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // refactor this method and rewrite the code pls

  // why types validations are missing?
  async findAll(req: any, options: PaginationDto) {
    const { user } = req;

    if (user?.userRole !== UserRoles.ADMIN)
      throw new HttpException(
        FORBIDDEN_RESPONSE.message,
        FORBIDDEN_RESPONSE.status,
      );

    const { limit, page, search, startDate, endDate } = options;

    const skip = (page - 1) * limit;

    const dateFilter =
      startDate && endDate
        ? Between(startDate as Date, endDate as Date)
        : undefined;

    const condition = search ? ILike('%' + search + '%') : undefined;

    const data = await this.userRepo.findAndCount({
      where:
        condition || dateFilter
          ? [
              {
                id: Not(user.id),
                userProfile: {
                  fullName: condition,
                },
                createdAt: dateFilter,
              },
              {
                id: Not(user.id),
                userProfile: {
                  firstName: condition,
                },
                createdAt: dateFilter,
              },
              {
                id: Not(user.id),
                userProfile: {
                  lastName: condition,
                },
                createdAt: dateFilter,
              },
              {
                id: Not(user.id),
                email: condition,
                createdAt: dateFilter,
              },
            ]
          : { id: Not(user.id) },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      relations: {
        userProfile: true,
        subscriptions: true,
        socialLogin: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });

    const finalResponse = helper.paginateResponse(data, page, limit);
    return finalResponse;
  }

  async delete(id: string) {
    const user = await this.userRepo.softDelete({
      id: id,
    });
    return user;
  }

  async getByUserById(id: string): Promise<Users> {
    const isUser = await this.userRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        subscriptions: true,
        userProfile: true,
      },
      order: {
        subscriptions: {
          createdAt: 'DESC',
        },
      },
    });
    return isUser;
  }
}
