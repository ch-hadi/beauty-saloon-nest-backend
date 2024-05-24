import { IsPlanActiveType } from '@/common/constants/enum';
import Model from '@/common/entities/Model.entity';
import { Users } from '@/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('userSubscription')
export class UserSubscription extends Model {
  @Column({ type: 'varchar', length: 100 })
  plan: string;

  @Column({ name: 'subscription_id', nullable: true, default: '' })
  subscriptionId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: IsPlanActiveType,
    default: IsPlanActiveType.ACTIVE,
  })
  isActive: IsPlanActiveType;

  // @Column({ default: false })
  // isPlanExp: boolean;
  // @AfterUpdate()
  // updatePlanExp() {
  //   if (this.expiryDate === undefined) this.isPlanExp = true;
  // }

  @Column({ default: 0 })
  consumedCounts: number;

  @Column({ default: 0 })
  usedContracts: number;

  @Column({ default: 0 })
  totalContracts: number;

  @Column({ default: 0 })
  totalUserDefinedQuestion: number;

  @Column({ default: 0 })
  consumeUserDefinedQuestion: number;

  @ManyToOne(() => Users, (user) => user.subscriptions, {
    onDelete: 'CASCADE',
  })
  author: Users;
}
