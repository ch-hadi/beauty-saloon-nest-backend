import Model from '@/common/entities/Model.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  AfterLoad,
  OneToOne,
} from 'typeorm';
import { helper } from '@/helper';
import { SocialLogins } from './socialLogin.entity';
import { SubscriptionType, UserRoles } from '@/common/constants/enum';
import { UserSubscription } from '@/stripe/entities/stripe.entity';
import { UserProfile } from '@/user-profile/entities/user-profile.entity';

@Entity('users')
export class Users extends Model {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'active', default: true })
  isActive: boolean;

  @Column({
    name: 'otp_code',
    type: 'varchar',
    length: '25',
    nullable: true,
    default: '',
  })
  otpCode: string;

  @Column({
    name: 'otp_expiry',
    default: null,
    type: 'timestamp',
  })
  OtpExpiryTime: Date;

  @Column({ nullable: true })
  password: string;
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await helper.hashPassword(this.password);
    }
  }

  @Column({ name: 'need_change_password', default: false })
  needChangePassword: boolean;

  // User role column
  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  userRole: UserRoles;

  // Last login date time
  @Column({
    type: 'timestamp',
    name: 'lastLoginAt',
    nullable: true,
  })
  lastLoginAt: Date;
  @AfterLoad()
  updateLoginDateTime() {
    this.lastLoginAt = new Date();
  }

  // login counter
  @Column({
    type: 'bigint',
    name: 'loginCount',
    default: 0,
  })
  loginCount: number;
  @AfterLoad()
  updateLoginCounter() {
    this.loginCount += 1;
  }

  // This coumn will store the customer id provided by the stripe
  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  stripeCustomerId: string;

  // User's subscriptions type
  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.FREE,
  })
  subscriptionType: SubscriptionType;

  // One to many relationship with social login entity
  @OneToMany(() => SocialLogins, (socialLogin) => socialLogin.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  socialLogin: SocialLogins[];
  // One to many relationship with user Subscription entity
  @OneToMany(() => UserSubscription, (subscription) => subscription.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subscriptions: UserSubscription[];

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  userProfile: UserProfile;
}
