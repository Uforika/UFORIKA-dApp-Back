import { CookieOptions, Response } from 'express';
import { COOKIE, AUTH } from 'config';
import { AUTH_TOKEN_TYPES } from '@libs/auth/constants/token.constants';
import { SignInResponseDTO } from '../dtos/auth.controller.dtos';

export const prepareAuthCookieOptions = ({
  type,
  rememberMe,
}: {
  type: AUTH_TOKEN_TYPES;
  rememberMe: boolean;
}): CookieOptions => ({
  sameSite: COOKIE.SAME_SITE,
  secure: COOKIE.SECURE,
  httpOnly: true,
  ...(rememberMe && {
    expires: new Date(
      Date.now() +
        (type === AUTH_TOKEN_TYPES.ACCESS_TOKEN ? AUTH.ACCESS_TOKEN_EXPIRES_SECS : AUTH.REFRESH_TOKEN_EXPIRES_SECS) *
          1000,
    ),
  }),
});

export const setAuthCookieToResponse = (response: Response, auth: SignInResponseDTO): void => {
  response.cookie(
    AUTH_TOKEN_TYPES.ACCESS_TOKEN,
    auth.accessToken,
    prepareAuthCookieOptions({ type: AUTH_TOKEN_TYPES.ACCESS_TOKEN, rememberMe: true }),
  );
  response.cookie(
    AUTH_TOKEN_TYPES.REFRESH_TOKEN,
    auth.refreshToken,
    prepareAuthCookieOptions({ type: AUTH_TOKEN_TYPES.REFRESH_TOKEN, rememberMe: true }),
  );
};

export const clearAuthCookie = (response: Response): void => {
  const options = {
    sameSite: COOKIE.SAME_SITE,
    secure: COOKIE.SECURE,
    httpOnly: true,
  };

  response.clearCookie(AUTH_TOKEN_TYPES.ACCESS_TOKEN, options);
  response.clearCookie(AUTH_TOKEN_TYPES.REFRESH_TOKEN, options);
};
