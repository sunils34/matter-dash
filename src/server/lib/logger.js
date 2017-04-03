import logger from 'winston';

/*
logger.configure({
  transports: [(new (logger.transports.Console)({
    timestamp: () => (
      Date.now()
    ),
    formatter: options => (
      // Return string will be passed to logger.
      options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')
    ),
  }))
  ]
});
*/

export default logger;
