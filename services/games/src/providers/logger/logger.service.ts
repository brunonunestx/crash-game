/* eslint-disable no-console */
import { LoggerService } from "@nestjs/common";

export class Logger implements LoggerService {
  log(message: unknown, ...args: unknown[]) {
    console.log(message, ...args);
  }

  error(message: unknown, ...args: unknown[]) {
    console.error(message, ...args);
  }

  warn(message: unknown, ...args: unknown[]) {
    console.warn(message, ...args);
  }

  debug(message: unknown, ...args: unknown[]) {
    console.debug(message, ...args);
  }
}
