import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import jwt from 'jsonwebtoken';
import util from 'util';
import auth from './config/auth';
import logger from 'winston';

import db from './database/mysql/models';

const WHITELISTED_EMAILS = process.env.ADMIN_EMAILS.split(',');
let OrgId = process.env.ORG_ID || 'app';

const configure = (app) => {

  function addJWT(user){
    const token = jwt.sign({ email: user.email }, auth.jwt.secret, {
      expiresIn: 86400000 //24 hours
    });
    return Object.assign({}, user.toJSON(), {token});
  }

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });



  // the callback after google has authenticated the user
  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) { return res.redirect(`/signin?error=${err}`) }
      if (!user) { return res.redirect(`/signin?error=No Valid User`); }

      req.login(user, (err) => {
        logger.info("user login", {user_id: user.id});
        if (err) { return next(err); }
        return res.redirect('/');
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
          if (WHITELISTED_EMAILS.indexOf(profile.emails[0].value) < 0) {
            logger.warn('user denied', { user_id: profile.emails[0].value, whitelist: WHITELISTED_EMAILS });
            return done('This user was not found');
          }

          // create user
          const newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            profileId: profile.id,
            profileType: profile.provider,
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

  //TODO make this more efficient than storing the entire user object in
  //the session
  passport.serializeUser(function (user, cb) {
    const data = {id: user.id, token: user.token}
    cb(null, data);
  });

  passport.deserializeUser(function (obj, cb) {
    const findUser = async() => {
      let user = await db.User.findOne({where: {id: obj.id}});
      cb(null, user);
    }
    findUser().catch(cb);
  });
};

export default configure;
