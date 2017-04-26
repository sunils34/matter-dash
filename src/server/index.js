import 'babel-polyfill';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import expressGraphQL from 'express-graphql';
import sequelizeStore from 'connect-sequelize';
import expressReactViews from 'express-react-views';
import csrf from 'csurf';

import schema from './graphql/schema';
import configureAuth from './configureAuth';
import db from './database/mysql/sequelize';
import sequelizeTables from './database/mysql/models';
import logger from './lib/logger';
import { isAuthenticated, isNotAuthenticated, isSuperAdmin } from './lib/middleware';
import routes from './lib/routes';


const SequelizeStore = sequelizeStore(session);

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const appdir = path.resolve(path.join(__dirname, `/../../build/${env}`));

const app = express();

const store = new SequelizeStore(db, {}, 'sessions');

// set up middleware limits
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));


const sessionDetails = {
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 },
};

if (env === 'prod') {
  app.set('trust proxy', 1);
  sessionDetails.cookie.secure = true;
}

app.use(session(sessionDetails));
app.use(flash({ locals: 'flash' }));
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

// set up server side react view engine
app.set('view engine', 'jsx');
app.engine('jsx', expressReactViews.createEngine());

// Serve static assets from client and server public directories
app.use(express.static(path.join(appdir, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dist/core.js', (req, res) => {
  res.header('Content-Type', 'application/javascript');
  res.send(`window.CSRF_TOKEN='${req.csrfToken()}'`);
});

app.get('/dist/bundle*', (req, res) => {
  if (!(env === 'dev')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  const bundleDir = appdir + req.path;
  res.sendFile(bundleDir);
});

app.get('/dist/bundle*.js.map', (req, res) => {
  // Set cache on everything except local development
  if (!(env === 'dev')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  const bundleDirMap = appdir + req.path;
  res.sendFile(bundleDirMap);
});


// set up oauth and login middleware
configureAuth(app);
routes(app);

app.get('/signin', isNotAuthenticated, (req, res) => {
  logger.info('user load signin');
  res.render('pages/signin.ejs');
});


app.get('/admin/sudo', isSuperAdmin, (req, res) => {
  if (req.query.user_id) {
    logger.info('user admin impersonate', { admin: req.user.email, impersonating: req.query.user_id });
    req.session.passport.user.impersonate = req.query.user_id;
    req.session.save(() => {
      res.redirect('/');
    });
  } else {
    res.json({'error': 'Invalid user id to impersonate'});
  }
});

app.get('/admin/sudo/logout', isAuthenticated, (req, res) => {
  delete req.session.passport.user.impersonate;
  req.session.save(() => {
    res.redirect('/');
  });
});

app.use('/graphql', expressGraphQL((req, res) => {
  // TODO CSRF protection
  if (!req.isAuthenticated()) {
    logger.warn('Un-signed in access to /graphql');
    res.json({ error: 'This endpoint is only accessible to a logged in user' });
    return false;
  }

  const context = {
    user: req.user,
  };

  return {
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    rootValue: { request: req },
    context,
    pretty: true,
  };
}));

app.get('*', isAuthenticated, (req, res) => {
  const indexPath = `${appdir}/index.html`;
  res.sendFile(indexPath);
});

const port = process.env.PORT || 4000;

// sync tables
sequelizeTables.sync({ force: false }).catch(err => logger.error(err.stack)).then(() => {
  app.listen(port, () => logger.info(`Now browse to localhost:${port}/graphql`));
});
