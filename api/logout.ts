import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Destroy the user cookie
  res.setHeader('Set-Cookie', cookie.serialize('user', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  }));
  res.json({ success: true });
}