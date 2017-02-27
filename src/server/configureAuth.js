import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import jwt from 'jsonwebtoken';
import util from 'util';
import auth from './config/auth';

import {User, Organization} from './database/mysql/models';

const WHITELISTED_EMAILS = ['l.widrich@gmail.com', 'hello@lauramcguigan.com', 'sunils34@gmail.com', 'mferber@xogrp.com'];

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
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/signin'
  }));

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

    const findOrCreateUserGoogleUser = async() => {
      if (profile) {
        let user = await User.findOne({
          where: {profileType: profile.provider, profileId: profile.id}
        });

        if (!user) {
          if (WHITELISTED_EMAILS.indexOf(profile.emails[0].value) < 0) {
            return null;
          }
          // create user
          const newUser = {
            name : profile.displayName,
            email : profile.emails[0].value,
            profileId: profile.id,
            profileType: profile.provider,
          }
          user = await User.create(newUser);

          //TODO obtain real organization
          let organization = await Organization.findOne({where: {id:'xogroup'}});
          await organization.addUser(user);
        }

        // if a user is found, log them in
        const userWithJWT = addJWT(user);
        done(null, userWithJWT);
      }

    };
    findOrCreateUserGoogleUser().catch(done)

  }));

  //TODO make this more efficient than storing the entire user object in
  //the session
  passport.serializeUser(function (user, cb) {
    const data = {id: user.id, token: user.token}
    cb(null, data);
  });

  passport.deserializeUser(function (obj, cb) {
    const findUser = async() => {
      let user = await User.findOne({where: {id: obj.id}});
      cb(null, user);
    }
    findUser().catch(cb);
  });
};

export default configure;
