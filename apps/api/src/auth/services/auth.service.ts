import { Inject, Injectable } from '@nestjs/common';
import { AuthService as AuthServiceLib, RefreshTokenService } from '@libs/auth';
import { AUTH_ERRORS_INVALID_SIGNATURE } from '@libs/constants/form-errors';
import { UnauthorizedError } from '@libs/exceptions';
import { SignInResponseDTO } from '../dtos/auth.controller.dtos';

@Injectable()
export class AuthService {
  @Inject() private readonly authService: AuthServiceLib;
  @Inject() private readonly refreshTokenService: RefreshTokenService;

  async signIn(address: string, signature: string): Promise<SignInResponseDTO> {
    let user;
    try {
      user = await this.authService.signIn(address, signature);
    } catch (e) {
      throw new UnauthorizedError([{ field: 'signature', message: AUTH_ERRORS_INVALID_SIGNATURE, details: e.message }]);
    }
    return this.authService.createAuthResponse(user.id);
  }

  refreshToken(refreshToken: string): Promise<SignInResponseDTO> {
    return this.refreshTokenService.createTokensFromRefreshToken(refreshToken);
  }

  getSignMessage(): string {
    return this.authService.getSignMessage();
  }

  async signOut(refreshToken: string | null): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
    }
  }
}
