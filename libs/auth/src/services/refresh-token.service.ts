import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from '@libs/entities/refresh-token.entity';
import { UnprocessableEntityError } from '@libs/exceptions';
import { AUTH_ERRORS_INVALID_REFRESH_TOKEN, AUTH_ERRORS_REFRESH_TOKEN_IS_REVOKED } from '@libs/constants/form-errors';
import { AuthResponseType, RefreshTokenPayload } from '../dtos/jwt.payload.dto';
import { AuthLibUsersRepository } from '../repositories/auth-lib-users.repository';
import { AuthLibRefreshTokensRepository } from '../repositories/auth-lib-refresh-tokens.repository';
import { AUTH_TOKEN_TYPES } from '../constants/token.constants';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly refreshTokenRepository: AuthLibRefreshTokensRepository,
    private readonly usersRepository: AuthLibUsersRepository,
  ) {}

  async createTokensFromRefreshToken(refreshToken: string): Promise<AuthResponseType> {
    const decodedToken = await this.decodeRefreshToken(refreshToken, false);
    const user = await this.usersRepository.findOne(decodedToken.id);
    const oldRefreshToken = await this.getRefreshTokenOrFail(decodedToken.id, decodedToken.jwtid);
    const result = await this.refreshTokenRepository.revokeRefreshToken(oldRefreshToken.id);
    if (!result.affected) {
      throw new UnprocessableEntityError([{ field: 'refreshToken', message: AUTH_ERRORS_INVALID_REFRESH_TOKEN }]);
    }
    return this.authService.createAuthResponse(user.id);
  }

  async decodeRefreshToken(refreshToken: string, ignoreExpiration: boolean): Promise<RefreshTokenPayload> {
    let result: RefreshTokenPayload | null = null;
    try {
      result = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, { ignoreExpiration });
    } catch (e) {}

    if (!result || result.type !== AUTH_TOKEN_TYPES.REFRESH_TOKEN) {
      throw new UnprocessableEntityError([{ field: 'refreshToken', message: AUTH_ERRORS_INVALID_REFRESH_TOKEN }]);
    }

    return result;
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const token = await this.decodeRefreshToken(refreshToken, true);
    await this.refreshTokenRepository.revokeRefreshToken(token.jwtid);
  }

  private async getRefreshTokenOrFail(userId: number, refreshTokenId: number): Promise<RefreshTokenEntity> {
    const refreshToken = await this.refreshTokenRepository.findOne({ id: refreshTokenId, userId });
    if (!refreshToken) {
      throw new UnprocessableEntityError([{ field: 'refreshToken', message: AUTH_ERRORS_INVALID_REFRESH_TOKEN }]);
    }
    if (refreshToken.isRevoked) {
      throw new UnprocessableEntityError([{ field: 'refreshToken', message: AUTH_ERRORS_REFRESH_TOKEN_IS_REVOKED }]);
    }
    return refreshToken;
  }
}
