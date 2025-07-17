import { PREFIX_LOG_NAME } from '@src/common/modules/logger/logger.constant';
import chalk from 'chalk';
import path from 'path';
import winston, { format, LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';

const DEFAULT_LOG_DIR: string = path.join(__dirname, '../../../../logs/');

const buildTimestampFormat = (info: winston.Logform.TransformableInfo): string => {
  const now = new Date(info.timestamp as string);
  const datePart = now.toLocaleDateString('en-US');
  const timePart = now.toLocaleTimeString('en-US', {
    hour12: true,
  });
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  return `${datePart}, ${timePart}.${ms}`;
};

const customFormat = (type: 'console' | 'file') =>
  format.combine(
    format.timestamp(),
    format.splat(),
    format.printf(info => {
      const pid = process.pid;
      const timestamp = buildTimestampFormat(info);

      const level = info.level.toUpperCase();
      const message = info.message as string;

      return type === 'console'
        ? `${chalk.green(`[${PREFIX_LOG_NAME}]`)} ${chalk.yellow(pid.toString())}  - ${chalk.magenta(timestamp)}     ${chalk.cyan(level)} ${message}`
        : `[${PREFIX_LOG_NAME}] ${pid}  - ${timestamp}     ${level} ${message}`;
    }),
  );

function buildWinstonConfig(logLevel: string, logDir: string): LoggerOptions {
  return {
    level: logLevel,
    transports: [
      new winston.transports.Console({
        format: customFormat('console'),
      }),
      new DailyRotateFile({
        filename: '%DATE%.log',
        dirname: logDir,
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '40m',
        maxFiles: '30d',
        zippedArchive: true,
        handleExceptions: true,
        format: customFormat('file'),
      }),
    ],
    exitOnError: false,
  };
}

export default (logLevel: string, logDir = DEFAULT_LOG_DIR) =>
  winston.createLogger(buildWinstonConfig(logLevel, logDir));
