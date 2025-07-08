const cookie = require('cookie');
const crypto = require('crypto');

// In-memory session store (for demo only; use Redis or DB for production)
const sessions = global._sessions || (global._sessions = {});

/**
 * API handler for /api/info
 * Reads the session token from the cookie, looks up the user in the session store, and returns user info.
 * Compatible with Vercel serverless environment.
 */
function handler(req, res) {
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    let user = null;
    if (cookies.session) {
      const session = sessions[cookies.session];
      if (session && session.user) {
        user = session.user;
      }
    }
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('API /api/info error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = handler;
