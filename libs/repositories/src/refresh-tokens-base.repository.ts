import { Repository } from 'typeorm';

import { RefreshTokenEntity } from '@libs/entities/refresh-token.entity';

export abstract class RefreshTokensBaseRepository extends Repository<RefreshTokenEntity> {}
