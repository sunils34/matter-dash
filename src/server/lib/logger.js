import winston from 'winston';
import { serialize } from 'winston/lib/winston/common';

const jsonFormatter = (key, value) => (
  value instanceof Buffer
    ? value.toString('base64')
    : value
);

const formatter = options => {
  // Return string will be passed to logger.
  return winston.config.colorize(options.level,' matter-app ' +  options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
     ((options.meta && Object.keys(options.meta).length) ?  ' ' + serialize(options.meta) : '') + ' ');
};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  timestamp: true,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'verbose',
  colorize: true,
  formatter,
});

export default winston;
