const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const cookie = require('cookie');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

async function handler(req, res) {
  try {
    // Log all relevant environment variables
    console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
    console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? '[set]' : '[missing]');
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('Request query:', req.query);

    const code = req.query.code;
    if (!code) {
      console.error('Missing code in query');
      return res.status(400).send('Missing code');
    }

    // Exchange code for access token
    const clientId = process.env.DISCORD_CLIENT_ID || '';
    const clientSecret = process.env.DISCORD_CLIENT_SECRET || '';
    const redirectUri = process.env.NEXT_PUBLIC_BASE_URL || '';
    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing required environment variables:', {
        clientId,
        clientSecret: clientSecret ? '[set]' : '[missing]',
        redirectUri
      });
      return res.status(500).send('Missing required environment variables for Discord OAuth');
    }
    const finalRedirectUri = `${redirectUri}/api/discord-callback`;
    console.log('Final redirect_uri sent to Discord:', finalRedirectUri);
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', finalRedirectUri);
    params.append('scope', 'identify guilds guilds.members.read');

    let tokenRes;
    try {
      tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      console.log('Token response status:', tokenRes.status);
    } catch (err) {
      console.error('Error fetching Discord token:', err);
      return res.status(500).send('Error fetching Discord token');
    }
    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Failed to get token:', err);
      return res.status(401).send('Failed to get token: ' + err);
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    console.log('Successfully obtained access token.');

    // Fetch user info
    let userRes, user;
    try {
      userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('User info response status:', userRes.status);
      user = await userRes.json();
      console.log('Fetched user info:', user);
    } catch (err) {
      console.error('Error fetching Discord user info:', err);
      return res.status(500).send('Error fetching Discord user info');
    }

    // Fetch user guilds
    let guildsRes, guilds;
    try {
      guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('Guilds response status:', guildsRes.status);
      guilds = await guildsRes.json();
      console.log('Fetched user guilds:', guilds);
    } catch (err) {
      console.error('Error fetching Discord user guilds:', err);
      return res.status(500).send('Error fetching Discord user guilds');
    }

    // Store user info in a cookie (for demo; use a real session in production)
    try {
      res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify({ ...user, guilds }), {
        httpOnly: false, // for local dev: allow JS access
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }));
      console.log('User cookie set successfully.');
    } catch (err) {
      console.error('Error setting cookie:', err);
      return res.status(500).send('Error setting cookie');
    }

    // Redirect to frontend login page
    console.log('Redirecting to frontend login page:', `${frontendUrl}/login`);
    res.redirect(`${frontendUrl}/login`);
  } catch (err) {
    console.error('API /discord-callback error:', err);
    res.status(500).send('Internal server error');
  }
}

module.exports = handler;