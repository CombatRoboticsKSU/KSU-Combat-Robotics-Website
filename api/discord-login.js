// Load .env for local development
if (!process.env.VERCEL) {
  require('dotenv').config();
}

function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/discord-callback`;
  const scope = 'identify guilds guilds.members.read';
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  res.redirect(discordAuthUrl);
}

module.exports = handler;