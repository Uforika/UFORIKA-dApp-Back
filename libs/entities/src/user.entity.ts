import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { USER_ROLE } from '@libs/constants';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ unique: true })
  @Expose()
  email: string;

  @Column({ type: 'enum', enum: USER_ROLE })
  @Expose()
  role: USER_ROLE;
}
