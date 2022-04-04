declare module 'config' {
  export const CORS: boolean;

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

  export const SENTRY: {
    readonly ENABLED: boolean;
    readonly DSN: string;
  };
}
