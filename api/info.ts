const cookie = require('cookie');


function handler(req, res) {
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    let user = null;
    if (cookies.user) {
      try {
        user = JSON.parse(cookies.user);
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
        user = null;
      }
    }
    res.json({ user });
  } catch (err) {
    console.error('API /info error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handler;
