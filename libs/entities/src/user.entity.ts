import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ unique: true })
  address: string;
}
