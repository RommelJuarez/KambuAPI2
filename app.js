const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  next();
});
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'] }));
app.use(cors({ origin: '*' }));
app.use(express.json());

// Session y Passport
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Rutas públicas
app.get('/', (req, res) => {
  res.send(req.session.user !== undefined
    ? `Logged in as: ${req.session.user.displayName}`
    : 'Logged out');
});
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: true
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Tus rutas
app.use('/', require('./routes'));

module.exports = app; // 👈 Esto es clave para poder usarlo en los tests
