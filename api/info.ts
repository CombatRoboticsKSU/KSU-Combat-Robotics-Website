const cookie = require('cookie');

function handler(req, res) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  let user = null;
  if (cookies.user) {
    try {
      user = JSON.parse(cookies.user);
    } catch (e) {
      user = null;
    }
  }
  res.json({ user });
}

module.exports = handler;