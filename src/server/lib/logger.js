import winston from 'winston';

const formatter = options => (
  // Return string will be passed to logger.
  winston.config.colorize(options.level, 'matter-app ' + options.level + ' ' + (options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''))
);

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  timestamp: true,
  level: 'error',
  colorize: true,
  formatter,
});

winston.setLevels({
  error: 4,
  warn: 3,
  info: 2,
  debug: 1,
  verbose: 0,
});

export default winston;
