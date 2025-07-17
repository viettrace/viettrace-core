import { Injectable, Scope } from '@nestjs/common';
import { WinstonInit } from '@src/common/modules/logger/logger-init.service';
import chalk from 'chalk';
import { ClsService } from 'nestjs-cls';
import { Logger } from 'winston';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class WinstonService {
  private prefix?: string;
  private winstonInstance: Logger;

  constructor(
    private readonly cls: ClsService,
    private readonly winstonInit: WinstonInit,
  ) {
    this.winstonInstance = this.winstonInit.getInstance();
  }

  info(message: string, ...args: unknown[]) {
    this.winstonInstance.info(this.buildMessage(message), ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.winstonInstance.error(this.buildMessage(message), ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.winstonInstance.warn(this.buildMessage(message), ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.winstonInstance.debug(this.buildMessage(message), ...args);
  }

  verbose(message: string, ...args: unknown[]) {
    this.winstonInstance.verbose(this.buildMessage(message), ...args);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  buildMessage(message: string) {
    const id = this.cls.getId();
    const requestId = id ? `${chalk.green('[Request-ID]')} ${chalk.yellow(this.cls.getId())} ` : '';

    if (this.prefix) {
      return `${chalk.green('[' + this.prefix + ']')} ${requestId} ${message}`;
    }

    return message;
  }
}
