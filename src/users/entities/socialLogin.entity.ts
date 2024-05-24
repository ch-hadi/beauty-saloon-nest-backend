import { AuthenticationProviders } from '@/common/constants/enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import Model from '@/common/entities/Model.entity';

@Entity('social_logins')
export class SocialLogins extends Model {
  @Column({
    type: 'enum',
    enum: AuthenticationProviders,
  })
  AuthenticationProvider: AuthenticationProviders;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  ProviderKey: string;

  // Many to one relationship with user entity
  // If a user is deleted all related records will also be deleted
  @ManyToOne(() => Users, (user) => user.socialLogin, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
