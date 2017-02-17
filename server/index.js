
import express from 'express';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import expressJWT from 'express-jwt';
import session from 'express-session';
import expressGraphQL from 'express-graphql';
import schema from './graphql/schema';
import configureAuth from './configureAuth'
import mongoose from 'mongoose'
import mongodbStore from 'connect-mongodb-session'

const MongoDBStore = mongodbStore(session);

const app = express();
mongoose.connect(process.env.MONGO_URI);

var store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });


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

// set up oauth and login middleware
configureAuth(app);


app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: process.env.NODE_ENV == 'development',
  rootValue : {request: req},
  context: req.session,
  pretty: true
})));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('Now browse to localhost:'+port+'/graphql'));
