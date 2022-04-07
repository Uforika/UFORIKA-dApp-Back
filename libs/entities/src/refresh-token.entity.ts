import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, Index } from 'typeorm';
import { UserEntity } from '@libs/entities';
import { BaseEntity } from './base.entity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity<RefreshTokenEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Index()
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'bool', default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;
}
