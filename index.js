import dotenv from 'dotenv';

//load dev vars from local config
const env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;

if(env == 'development') {
  dotenv.config();
}


require('babel-register');
require('./src/server/index.js');
