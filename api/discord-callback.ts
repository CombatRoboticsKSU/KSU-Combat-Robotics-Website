const fetch = require('node-fetch');
const cookie = require('cookie');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  // Exchange code for access token
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord-callback`);
  params.append('scope', 'identify guilds guilds.members.read');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(401).send('Failed to get token: ' + err);
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch user info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await userRes.json();

  // Fetch user guilds
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const guilds = await guildsRes.json();

  // Store user info in a cookie (for demo; use a real session in production)
  res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify({ ...user, guilds }), {
    httpOnly: false, // for local dev: allow JS access
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  }));

  // Redirect to frontend login page
  res.redirect(`${frontendUrl}/login`);
}

module.exports = handler;