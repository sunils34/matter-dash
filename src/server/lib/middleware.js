import logger from 'winston';

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  logger.info('user unauth redirect');
  return res.redirect('/signin');
}

export function isNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/');
}
