import { Entity, Column, OneToOne, JoinColumn, VirtualColumn } from 'typeorm';
import { Users } from '@/users/entities/user.entity';
import Model from '@/common/entities/Model.entity';

@Entity()
export class UserProfile extends Model {
  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  lastName: string;

  @Column({ select: false, nullable: true })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ name: 'phone_number', nullable: true, default: '' })
  phoneNumber: string;

  @Column({ name: 'avatar', length: 150, default: '', nullable: true })
  avatar: string;

  @Column({ name: 'birth_date', nullable: true, default: '' })
  birthDate: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  city: string;

  @OneToOne(() => Users, (user) => user.userProfile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;
}
