// Minimal Discord bot to keep your bot online and able to fetch member roles
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
