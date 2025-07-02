import type { VercelRequest, VercelResponse } from '@vercel/node';

import cookie from 'cookie';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Destroy the user cookie
  res.setHeader('Set-Cookie', cookie.serialize('user', '', {
    httpOnly: false,
    path: '/',
    expires: new Date(0),
  }));
  res.json({ success: true });
}