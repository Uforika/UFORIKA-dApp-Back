import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/jwt.payload.dto';

import { AuthLibUsersRepository } from '../repositories/auth-lib-users.repository';
import { AUTH_TOKEN_TYPES } from '../constants/token.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: AuthLibUsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req): string => req?.cookies?.[AUTH_TOKEN_TYPES.ACCESS_TOKEN],
      ]),
      ignoreExpiration: false,
      secretOrKey: AUTH.SECRET,
    });
  }

  public validate(payload: JwtPayload): JwtPayload {
    if (!payload || payload.type !== AUTH_TOKEN_TYPES.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.id,
      type: payload.type,
    };
  }
}
