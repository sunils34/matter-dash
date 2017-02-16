
import express from 'express';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import expressJWT from 'express-jwt';
import session from 'express-session';
import expressGraphQL from 'express-graphql';
import schema from './graphql/schema';
import configureAuth from './configureAuth'


const app = express();

// set up middleware limits
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(expressJWT({ secret: process.env.JWT_SECRET}).unless({path: [/\/auth/i,  /\/graphql/i, /\/facebook/i ] }));


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 86400}
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
