declare module 'config' {
  export const CORS: boolean;
  export const CHAIN_ID: number;

  export const POSTGRES: {
    readonly HOST: string;
    readonly USERNAME: string;
    readonly PASSWORD: string;
    readonly PORT: number;
    readonly DB: string;
    readonly RETRY_ATTEMPTS: number;
    readonly RETRY_DELAY: number;
  };

  export const API: {
    readonly PORT: number;
  };

  export const AUTH: {
    readonly SECRET: string;
    readonly ACCESS_TOKEN_EXPIRES_SECS: number;
    readonly REFRESH_TOKEN_EXPIRES_SECS: number;
  };

  export const SENTRY: {
    readonly ENABLED: boolean;
    readonly DSN: string;
  };

  export const COOKIE: {
    readonly SAME_SITE: boolean | 'lax' | 'strict' | 'none';
    readonly SECURE: boolean;
  };
}
