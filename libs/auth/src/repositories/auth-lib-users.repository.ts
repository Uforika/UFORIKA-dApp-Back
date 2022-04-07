import { EntityRepository, TreeRepository } from 'typeorm';
import { UserEntity } from '@libs/entities';

@EntityRepository(UserEntity)
export class AuthLibUsersRepository extends TreeRepository<UserEntity> {}
