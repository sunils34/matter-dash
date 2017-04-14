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

export function isSuperAdmin(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'super_admin' || req.super_admin)) {
    return next();
  }

  // do not allow a user to continue to access a privileged route
  return res.redirect('/');
}
