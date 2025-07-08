const cookie = require('cookie');
const crypto = require('crypto');
const redis = require('./redis');

// In-memory session store (for demo only; use Redis or DB for production)
const sessions = global._sessions || (global._sessions = {});

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord-callback`;

module.exports = async (req, res) => {
  try {
    const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
    if (!code) {
      res.status(400).send('Missing code');
      return;
    }

    // Exchange code for access token
    const params = new URLSearchParams();
    if (clientId) params.append('client_id', clientId);
    if (clientSecret) params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('scope', 'identify guilds guilds.members.read');

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!tokenRes.ok) {
      res.status(401).send('Failed to get access token');
      return;
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData && tokenData.access_token;

    // Fetch user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    // Fetch guilds
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const guilds = await guildsRes.json();

    // Optionally, fetch member info for your guild to get roles
    const allowedGuildId = '972594004485103637';
    let member = null;
    try {
      const memberRes = await fetch(`https://discord.com/api/users/@me/guilds/${allowedGuildId}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (memberRes.ok) {
        member = await memberRes.json();
      }
    } catch (e) {
      // ignore
    }

    // Attach roles to the guild object
    if (Array.isArray(guilds)) {
      guilds.forEach((g) => {
        if (g.id === allowedGuildId && member && member.roles) {
          g.roles = member.roles;
        }
      });
    }

    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    // Store user info in Redis
    const userObj = (user && typeof user === 'object') ? { ...user, guilds } : { guilds };
    await redis.set(`session:${sessionToken}`, JSON.stringify({ user: userObj }), 'EX', 60 * 60 * 24 * 7); // 1 week expiry
    // Set session token in cookie
    res.setHeader('Set-Cookie', cookie.serialize('session', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }));

    // Redirect to login page
    res.writeHead(302, { Location: '/login' }).end();
    return;
  } catch (err) {
    console.error('discord-callback error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
