import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  let user = null;
  if (cookies.user) {
    try {
      const parsed = JSON.parse(cookies.user);
      user = parsed.user || null;
    } catch (e) {
      user = null;
    }
  }
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.status(200).json({ user });
}
