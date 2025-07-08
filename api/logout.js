const cookie = require('cookie');
const redis = require('./redis');

async function handler(req, res) {
  try {
    // Remove session from Redis if present
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    if (cookies.session) {
      await redis.del(`session:${cookies.session}`);
    }
    // Destroy the session cookie
    res.setHeader('Set-Cookie', cookie.serialize('session', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }));
    res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

module.exports = handler;