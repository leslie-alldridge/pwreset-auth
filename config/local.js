const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const init = require('./passport');
const knex = require('../server/db/connection');
const authHelpers = require('./_helpers');

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {
    console.log('im here in local');
    
  // check to see if the username exists
  knex('users').where({ username }).first()
  .then((user) => {
      console.log(user);
      
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
        console.log('comparing pass');
        
      return done(null, false);
    } else {
        console.log('comparing pass complete');
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;