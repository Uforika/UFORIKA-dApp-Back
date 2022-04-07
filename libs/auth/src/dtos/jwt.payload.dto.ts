import { AUTH_TOKEN_TYPES } from '../constants/token.constants';

export class JwtPayload {
  id: number;
  type: AUTH_TOKEN_TYPES;
}

export class RefreshTokenPayload extends JwtPayload {
  jwtid: number;
}

export class AuthResponseType {
  userId: number;
  accessToken: string;
  refreshToken: string;
}
