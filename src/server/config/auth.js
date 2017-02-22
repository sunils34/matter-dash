const auth = {
  'jwt' : {
    'secret': process.env.JWT_SECRET
  },
  'googleAuth' : {
    'clientID'      : process.env.GOOGLE_CLIENT_ID,
    'clientSecret'  : process.env.GOOGLE_CLIENT_SECRET,
    'callbackURL'   : process.env.GOOGLE_CALLBACK_URL
  }
}

export default auth;
