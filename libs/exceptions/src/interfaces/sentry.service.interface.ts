export interface ISentryService {
  init(serverName: string);
  install();
  warning(message: string, additionalData?);
  message(message: string, additionalData?);

  error(error: Error, key: string, additionalData?);
}
