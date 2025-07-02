const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

dotenv.config();
require('./auth');
const app = express();
const port = 4000;


// CORS middleware
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Add session middleware BEFORE passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Discord OAuth login route
app.get('/discord-login', passport.authenticate('discord'));

// Discord OAuth callback route
app.get('/discord-callback',
  passport.authenticate('discord', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000/login',
  })
);

// Public info endpoint for frontend
app.get('/info', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Logout endpoint (always returns JSON, never redirects)
app.get('/logout', (req, res) => {
  function finish() {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  }
  try {
    if (typeof req.logout === 'function') {
      if (req.logout.length > 0) {
        req.logout((err) => {
          if (err) {
            return res.status(500).json({ error: 'Logout failed', details: err?.message || err });
          }
          finish();
        });
      } else {
        Promise.resolve(req.logout()).then(finish).catch((err) => {
          res.status(500).json({ error: 'Logout failed', details: err?.message || err });
        });
      }
    } else {
      finish();
    }
  } catch (err) {
    res.status(500).json({ error: 'Logout failed', details: err?.message || err });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});