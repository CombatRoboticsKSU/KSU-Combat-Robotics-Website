import type { VercelRequest, VercelResponse } from '@vercel/node';
const cookie = require('cookie');

export default function handler(req: VercelRequest, res: VercelResponse) {
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