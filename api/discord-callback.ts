import fetch from 'node-fetch';
import cookie from 'cookie';

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord-callback`;

async function handler(req, res) {
  const code = req.query.code;
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

  const tokenData: any = await tokenRes.json();
  const accessToken = tokenData && tokenData.access_token;

  // Fetch user info

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user: any = await userRes.json();

  // Fetch guilds

  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const guilds = await guildsRes.json() as any[];

  // Optionally, fetch member info for your guild to get roles
  const allowedGuildId = '972594004485103637';

  let member: any = null;
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
    guilds.forEach((g: any) => {
      if (g.id === allowedGuildId && member && member.roles) {
        g.roles = member.roles;
      }
    });
  }

  // Save user info in a cookie (for demo, not secure for production)

  // Only spread if user is an object
  const userObj = (user && typeof user === 'object') ? { ...user, guilds } : { guilds };
  res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify({ user: userObj }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
  }));

  // Redirect to login page
  res.redirect('/login');
}

export default handler;
