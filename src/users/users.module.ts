import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { SocialLogins } from './entities/socialLogin.entity';
import { StripeService } from '@/stripe/stripe.service';
import { UserProfile } from '@/user-profile/entities/user-profile.entity';
import { UserSubscription } from '@/stripe/entities/stripe.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      SocialLogins,
      UserProfile,
      UserSubscription,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, StripeService],
  exports: [UsersService],
})
export class UsersModule {}
