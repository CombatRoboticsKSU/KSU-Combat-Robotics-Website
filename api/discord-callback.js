const cookie = require('cookie');

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord-callback`;


async function handler(req, res) {
  try {
    console.log('Handler started');
    const fetch = (await import('node-fetch')).default;
    const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
    if (!code) {
      console.log('No code in query');
      res.status(400).send('Missing code');
      return;
    }
    console.log('Code received:', code);

    // Exchange code for access token
    const params = new URLSearchParams();
    if (clientId) params.append('client_id', clientId);
    if (clientSecret) params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('scope', 'identify guilds guilds.members.read');

    console.log('Requesting token from Discord');
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.log('Token exchange failed:', text);
      res.status(401).send('Failed to get access token');
      return;
    }
    console.log('Token exchange succeeded');

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
    } catch (e) {}

    // Attach roles to the guild object
    if (Array.isArray(guilds)) {
      guilds.forEach((g) => {
        if (g.id === allowedGuildId && member && member.roles) {
          g.roles = member.roles;
        }
      });
    }

    // Save user info in a cookie (for demo, not secure for production)
    const userObj = (user && typeof user === 'object') ? { ...user, guilds } : { guilds };
    res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify({ user: userObj }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
    }));

    // Redirect to login page
    res.redirect('/login');
  } catch (err) {
    console.error('discord-callback error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = handler;
