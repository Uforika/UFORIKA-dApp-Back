export enum AUTH_TOKEN_TYPES {
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN = 'accessToken',
}

export const AUTH_ACCESS_TOKEN_EXPIRES_SECS = 10 * 60;
export const AUTH_REFRESH_TOKEN_EXPIRES_SECS = 90 * 24 * 60 * 60;
