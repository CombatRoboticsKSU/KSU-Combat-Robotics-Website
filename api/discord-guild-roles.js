// Use dynamic import for node-fetch (ESM)
/**
 * Fetches the member object for a user in a guild, including their roles.
 * @param {string} guildId - The Discord guild/server ID.
 * @param {string} userId - The Discord user ID.
 * @param {string} botToken - The bot token with guilds.members.read scope.
 * @returns {Promise<string[]>} Array of role IDs, or [] if not found.
 */
async function fetchGuildMemberRoles(guildId, userId, botToken) {
  const fetch = (await import('node-fetch')).default;
  const url = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.roles) ? data.roles : [];
}

module.exports = { fetchGuildMemberRoles };
