
import 'babel-polyfill'
import express from 'express';
import path from 'path';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import expressJWT from 'express-jwt';
import session from 'express-session';
import expressGraphQL from 'express-graphql';
import schema from './graphql/schema';
import cookieParser from 'cookie-parser';
import configureAuth from './configureAuth';
import db from './database/mysql/sequelize';
import sequelizeTables from './database/mysql/models';
import sequelizeStore from 'connect-sequelize';

var SequelizeStore = sequelizeStore(session);


import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/server';
import expressReactViews from 'express-react-views';



const env = process.env.NODE_ENV == 'production' ? 'prod' : 'dev';
const appdir = path.resolve(__dirname + '/../../build/' + env);

const app = express();

const store = new SequelizeStore(db, {}, 'sessions')

// set up middleware limits
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: store,
  saveUninitialized: false,
  cookie: {maxAge: 86400000}
}));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// set up server side react view engine
app.set('view engine', 'jsx');
app.engine('jsx', expressReactViews.createEngine());


// set up oauth and login middleware
configureAuth(app);

app.get('/signin', (req, res) => {
  if(req.isAuthenticated()) {
    //redirect to the app
    res.redirect('/');
  }
  else {
    res.render('pages/signin.ejs')
  }
});

app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: process.env.NODE_ENV == 'development',
  rootValue : {request: req},
  context: req.session,
  pretty: true
})));

app.get('/dist/core.js', function (req, res) {
  res.header("Content-Type", "application/javascript");
  const codejs = "window.SLACK_CLIENT_ID=\"" + "TEST" + "\";\n";
  res.send(codejs);
});

app.get('/dist/bundle*.js', function (req, res) {
  if (!(env == 'dev')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  var path = req.path;
  var bundleDir = appdir + path;
  res.sendFile(bundleDir);
});

app.get('/dist/bundle*.js.map', function (req, res) {
  // Set cache on everything except local development
  if (!(env == 'dev')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  var path = req.path;
  var bundleDirMap = appdir + path;
  res.sendFile(bundleDirMap);
});



app.get('*', function (req, res) {

  if(!req.isAuthenticated()) {
    res.redirect('/signin');
  }
  else {
    var indexPath = appdir + '/index.html';
    res.sendFile(indexPath);
  }
});

const port = process.env.PORT || 4000;

//sync tables
sequelizeTables.sync({force: false}).catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => console.log('Now browse to localhost:'+port+'/graphql'));
});
