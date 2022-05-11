import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { UserEntity } from '@libs/entities';
import { Web3Service } from '@libs/web3';
import { AuthResponseType } from '../dtos/jwt.payload.dto';
import { AuthLibUsersRepository } from '../repositories/auth-lib-users.repository';
import { AuthLibRefreshTokensRepository } from '../repositories/auth-lib-refresh-tokens.repository';
import {
  AUTH_ACCESS_TOKEN_EXPIRES_SECS,
  AUTH_REFRESH_TOKEN_EXPIRES_SECS,
  AUTH_TOKEN_TYPES,
} from '../constants/token.constants';

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
      throw new Error('Invalid signature');
    }
    let user = await this.userRepository.findActiveOne({ address });
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
      dayjs().add(AUTH_REFRESH_TOKEN_EXPIRES_SECS, 'seconds').toISOString(),
    );
    const accessTokenPayload = { type: AUTH_TOKEN_TYPES.ACCESS_TOKEN, id: userId };
    const refreshTokenPayload = {
      type: AUTH_TOKEN_TYPES.REFRESH_TOKEN,
      id: userId,
      jwtid: refreshToken.id,
    };
    return {
      userId,
      accessToken: this.jwtService.sign(accessTokenPayload, { expiresIn: AUTH_ACCESS_TOKEN_EXPIRES_SECS }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, { expiresIn: AUTH_REFRESH_TOKEN_EXPIRES_SECS }),
    };
  }
}
