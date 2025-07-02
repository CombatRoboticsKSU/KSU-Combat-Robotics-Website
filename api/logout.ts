const cookie = require('cookie');

function handler(req, res) {
  // Destroy the user cookie
  res.setHeader('Set-Cookie', cookie.serialize('user', '', {
    httpOnly: false,
    path: '/',
    expires: new Date(0),
  }));
  res.json({ success: true });
}

module.exports = handler;