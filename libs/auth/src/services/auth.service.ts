import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { AUTH } from 'config';
import { UserEntity } from '@libs/entities';
import { Web3Service } from '@libs/web3';
import { USER_STATUS } from '@libs/constants/user.constants';
import { AuthResponseType } from '../dtos/jwt.payload.dto';
import { AuthLibUsersRepository } from '../repositories/auth-lib-users.repository';
import { AuthLibRefreshTokensRepository } from '../repositories/auth-lib-refresh-tokens.repository';
import { AUTH_TOKEN_TYPES } from '../constants/token.constants';
import { ERROR_INVALID_SIGNATURE, ERROR_USER_IS_BLOCKED } from '../constants/error.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: AuthLibUsersRepository,
    private readonly web3Service: Web3Service,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: AuthLibRefreshTokensRepository,
  ) {}

  async signIn(address: string, signature: string): Promise<UserEntity> {
    address = this.web3Service.getCheckSummedAddress(address);
    if (!this.web3Service.verifySignature(address, signature)) {
      throw new Error(ERROR_INVALID_SIGNATURE);
    }
    let user = await this.userRepository.findOne({ address });
    if (user && user.status === USER_STATUS.BLOCKED) {
      throw new Error(ERROR_USER_IS_BLOCKED);
    }
    if (!user) {
      user = await this.userRepository.save({
        address: address,
      });
    }

    return user;
  }

  getSignMessage(): string {
    return this.web3Service.signMessage;
  }

  async createAuthResponse(userId: number): Promise<AuthResponseType> {
    const refreshToken = await this.refreshTokenRepository.createNewRefreshToken(
      userId,
      dayjs().add(AUTH.REFRESH_TOKEN_EXPIRES_SECS, 'seconds').toISOString(),
    );
    const accessTokenPayload = { type: AUTH_TOKEN_TYPES.ACCESS_TOKEN, id: userId };
    const refreshTokenPayload = {
      type: AUTH_TOKEN_TYPES.REFRESH_TOKEN,
      id: userId,
      jwtid: refreshToken.id,
    };
    return {
      userId,
      accessToken: this.jwtService.sign(accessTokenPayload, { expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_SECS }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, { expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_SECS }),
    };
  }
}
