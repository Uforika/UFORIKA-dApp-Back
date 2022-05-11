import { EntityRepository, TreeRepository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { UserEntity } from '@libs/entities';
import { USER_STATUS } from '@libs/constants/user.constants';

@EntityRepository(UserEntity)
export class AuthLibUsersRepository extends TreeRepository<UserEntity> {
  findActiveOne(
    conditions?: FindConditions<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | undefined> {
    return this.findOne(
      {
        ...conditions,
        status: USER_STATUS.ACTIVE,
      },
      options,
    );
  }
}
