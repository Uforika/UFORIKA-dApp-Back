import { Column, Entity } from 'typeorm';
import { USER_STATUS } from '@libs/constants/user.constants';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ unique: true })
  address: string;

  @Column({ enum: USER_STATUS, type: 'enum', default: USER_STATUS.ACTIVE })
  status: USER_STATUS;
}
