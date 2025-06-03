const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

// Local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        
        // If user not found or password doesn't match
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Return user if successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // Return existing user
          return done(null, user);
        }
        
        // Check if user exists with the same email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        user = await User.findOne({ email });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        });
        
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport; 