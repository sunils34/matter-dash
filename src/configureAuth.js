import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'
//import {User, UserClaim, comparePassword} from './database/models';
import jwt from 'jsonwebtoken';
import util from 'util';
import auth from '../config/auth';

import User from './database/mongo/models/User'


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
    successRedirect : '/api/me',
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
    process.nextTick(function() {

      // try to find the user based on their google id
      User.findOne({ 'google.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);

        if (user) {

          // if a user is found, log them in
          const userWithJWT = addJWT(user);

          return done(null, userWithJWT);
        } else {
          // if the user isnt in our database, create a new user
          var newUser          = new User();
          newUser.email = profile.emails[0].value;
          // set all of the relevant information
          newUser.google.id    = profile.id;
          newUser.google.token = token;
          newUser.google.name  = profile.displayName;
          newUser.google.email = profile.emails[0].value; // pull the first email

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, addJWT(newUser));
          });
        }
      });
    });

  }));

  //TODO make this more efficient than storing the entire user object in
  //the session
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};

export default configure;
