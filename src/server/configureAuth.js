import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import logger from 'winston';
import auth from './config/auth';

import db from './database/mysql/models';

const WHITELISTED_EMAILS = _.concat(process.env.MATTER_ADMINS.split(','), (process.env.ORG_ADMINS || '').split(','));
const OrgId = process.env.ORG_ID || 'app';

const configure = (app) => {
  function addJWT(user) {
    const token = jwt.sign({ email: user.email }, auth.jwt.secret, {
      expiresIn: 86400000, //24 hours
    });
    return Object.assign({}, user.toJSON(), { token });
  }

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => (
      res.redirect('/signin')
    ));
  });

  // the callback after google has authenticated the user
  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        req.flash('error', err);
        req.session.save(() => {
          res.redirect('/signin');
        });
      }
      if (!user) {
        const message = info.message || 'We were unable to authentication you as a valid user';
        logger.debug('flash error', message);
        req.flash('error', message);
        req.session.save(() => {
          res.redirect('/signin');
        });
      }

      req.login(user, (e) => {
        logger.info('user login', { user_id: user.id });
        if (e) { return next(e); }
        return req.session.save(() => (
          res.redirect('/')
        ));
      });
    })(req, res, next);
  });

  app.get('/api/me', (req, res) => {
    res.json({ user: req.user, auth: req.isAuthenticated()});
  });

  passport.use(new GoogleStrategy({
    clientID        : auth.googleAuth.clientID,
    clientSecret    : auth.googleAuth.clientSecret,
    callbackURL     : auth.googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google

    const findOrCreateUserGoogleUser = async () => {
      if (profile) {
        let user = await db.User.findOne({
          where: { profileType: profile.provider, profileId: profile.id },
        });

        if (!user) {
          const email = profile.emails[0].value;
          if (WHITELISTED_EMAILS.indexOf(email) < 0) {
            logger.warn('user denied', { user_id: profile.emails[0].value, whitelist: WHITELISTED_EMAILS });
            return done(null, false, {message: 'It looks like we can\'t quite find you in our system.  Want to try another email?'});
          }

          // for now assume all users created via signup are at least org admins
          const role = _.includes(process.env.MATTER_ADMINS, email) ? 'super_admin' : 'admin';

          // create user
          const newUser = {
            name: profile.displayName,
            email,
            emailConfirmed: true,
            profileId: profile.id,
            profileType: profile.provider,
            role,
          };
          user = await db.User.create(newUser);
          logger.info('user create', { id: user.id });

          // TODO obtain real organization
          const organization = await db.Organization.findOne({ where: { id: OrgId } });
          await organization.addUser(user);
          logger.info('user addOrg', { id: user.id, orgId: OrgId });
        }

        // if a user is found, log them in
        const userWithJWT = addJWT(user);
        return done(null, userWithJWT);
      }

      return done('Whoops, something went wrong when trying to authenticate you');

    };
    return findOrCreateUserGoogleUser().catch(done);

  }));

  passport.serializeUser((user, cb) => {
    const data = { id: user.id, token: user.token };
    if (user.impersonate) data.impersonate = user.impersonate;
    cb(null, data);
  });

  passport.deserializeUser((obj, cb) => {
    const findUser = async () => {
      let user = await db.User.findOne({ where: { id: obj.id } });
      if (obj.impersonate && user.role === 'super_admin') {
        const u = await db.User.findOne({ where: { id: obj.impersonate } });
        if (u) {
          // indicate that we're impersonating this user
          u.impersonating = true;
          u.super_admin = user;
          user = u;
        }
      }
      cb(null, user);
    };
    findUser().catch(cb);
  });
};

export default configure;
