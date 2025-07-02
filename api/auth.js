const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { fetchGuildMemberRoles } = require('./discord-guild-roles');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Combat Robotics Guild
const TARGET_GUILD_ID = '972594004485103637';

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/discord-callback',
    scope: ['identify', 'guilds', 'guilds.members.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Attach roles for the target guild
      if (Array.isArray(profile.guilds)) {
        for (let guild of profile.guilds) {
          if (guild.id === TARGET_GUILD_ID) {
            // Fetch roles using bot token
            const roles = await fetchGuildMemberRoles(
              TARGET_GUILD_ID,
              profile.id,
              process.env.DISCORD_BOT_TOKEN
            );
            guild.roles = roles;
          }
        }
      }
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }
));