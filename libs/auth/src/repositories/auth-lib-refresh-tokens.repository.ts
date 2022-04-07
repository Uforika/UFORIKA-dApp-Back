import { EntityRepository, UpdateResult } from 'typeorm';
import { RefreshTokenEntity } from '@libs/entities/refresh-token.entity';
import { RefreshTokensBaseRepository } from '@libs/repositories/refresh-tokens-base.repository';

@EntityRepository(RefreshTokenEntity)
export class AuthLibRefreshTokensRepository extends RefreshTokensBaseRepository {
  createNewRefreshToken(userId: number, expiredAt: string): Promise<RefreshTokenEntity> {
    return this.save({
      userId,
      isRevoked: false,
      expiredAt,
    });
  }

  revokeRefreshToken(id: number): Promise<UpdateResult> {
    return this.update({ id, isRevoked: false }, { isRevoked: true });
  }
}
