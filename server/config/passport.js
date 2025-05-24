import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import passport from "passport"
import dotenv from "dotenv"

dotenv.config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/user/google/callback",  // Adjust if deployed
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);  // User found, return the user
    }

    // Create a new user with a default 'User' role
    const newUser = new User({
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      role: 'User',  // Default role can be modified as needed
    });

    await newUser.save();
    done(null, newUser);  // Return the newly created user

  } catch (err) {
    done(err, false);
  }
}));
