var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;

function findById(id, fn) {
  User.findOne(id).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByFacebookId(id, fn) {
  
  User.findOne({
    facebookId: id
  }).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: "259639567744307",
    clientSecret: "328bf7eb158d7b97b792ad4724704ccd",
    callbackURL: "http://localhost:1337/user/facebook/callback",
    enableProof: false
  }, function (accessToken, refreshToken, profile, done) {

    findByFacebookId(profile.id, function (err, user) {

      if (!user) {
        User.create({

          facebookId: profile.id,
          full_name: profile.displayName

        }).exec(function (err, user) {
          if (user) {
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
          }
        });

      } else {
        return done(null, user, {
          message: 'Logged In Successfully'
        });
      }
    });
  }
));
