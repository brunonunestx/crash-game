import { LoggerService } from "@nestjs/common";

export class Logger implements LoggerService {
  log(message: any, ...args: any[]) {
    console.log(message, ...args);
  }

  error(message: any, ...args: any[]) {
    console.error(message, ...args);
  }

  warn(message: any, ...args: any[]) {
    console.warn(message, ...args);
  }

  debug(message: any, ...args: any[]) {
    console.debug(message, ...args);
  }
}
