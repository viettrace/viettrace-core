import { PREFIX_LOG_NAME } from '@src/common/modules/logger/logger.constant';
import { LogLevel } from '@src/shared/interfaces/log-level.interface';
import chalk, { ChalkInstance } from 'chalk';
import { join } from 'path';
import { format as utilFormat } from 'util';
import winston, { format, LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';

const DEFAULT_LOG_DIR: string = join(__dirname, '../../../../logs/');

const logLevelColorMapping = new Map<LogLevel, ChalkInstance>([
  ['error', chalk.hex('#FF3333')],
  ['warn', chalk.hex('#FFCC00')],
  ['info', chalk.hex('#4CAF50')],
  ['http', chalk.hex('#00B4D8')],
  ['verbose', chalk.hex('#BA68C8')],
  ['debug', chalk.hex('#2196F3')],
  ['silly', chalk.hex('#888888')],
]);

function transform(info: winston.Logform.TransformableInfo) {
  const args = info[Symbol.for('splat')];

  if (Array.isArray(args) && args?.length) {
    info.message = utilFormat(info.message, ...args);
  }
  return info;
}

function utilFormatter() {
  return { transform };
}

const buildTimestampFormat = (info: winston.Logform.TransformableInfo): string => {
  const now = new Date(info.timestamp as string);
  const datePart = now.toLocaleDateString('en-US');
  const timePart = now.toLocaleTimeString('en-US', {
    hour12: true,
  });
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  return `${datePart}, ${timePart}.${ms}`;
};

const customFormat = (type: 'console' | 'file') => {
  let chalkInstance: ChalkInstance = chalk.green;

  const formats = [
    format.timestamp(),
    utilFormatter(),
    format.printf(info => {
      const pid = process.pid;
      const timestamp = buildTimestampFormat(info);

      const level = info.level.toUpperCase();
      const message = info.message as string;

      if (logLevelColorMapping.has(info.level as LogLevel)) {
        chalkInstance = logLevelColorMapping.get(info.level as LogLevel) as ChalkInstance;
      }

      return `${chalk.green(`[${PREFIX_LOG_NAME}]`)} ${chalk.yellow(pid.toString())}  - ${chalk.magenta(timestamp)}     ${chalkInstance(level)} ${message}`;
    }),
  ];

  if (type === 'file') {
    formats.push(format.uncolorize());
  }

  return format.combine(...formats);
};

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
