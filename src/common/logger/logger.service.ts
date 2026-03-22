import { Injectable } from '@nestjs/common';
import { winstonLogger } from './winston.logger.js';

@Injectable()
export class LoggerService {
  log(message: string, meta?: any) {
    winstonLogger.info(message, meta);
  }

  error(message: string, trace?: any) {
    winstonLogger.error(message, trace);
  }

  warn(message: string, meta?: any) {
    winstonLogger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    winstonLogger.debug(message, meta);
  }
}
