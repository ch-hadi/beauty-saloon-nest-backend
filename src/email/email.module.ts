import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/users/entities/user.entity';
import { UserSubscription } from '@/stripe/entities/stripe.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users, UserSubscription])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
