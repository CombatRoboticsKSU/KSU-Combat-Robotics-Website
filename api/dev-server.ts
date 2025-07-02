const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all API handlers (support both ES module and CommonJS)
const infoHandler = require('./info').default || require('./info');
const logoutHandler = require('./logout').default || require('./logout');
const discordLoginHandler = require('./discord-login').default || require('./discord-login');
const discordCallbackHandler = require('./discord-callback').default || require('./discord-callback');

const app = express();
const port = 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Helper to adapt Vercel-style handlers to Express
function vercelToExpress(handler) {
  return (req, res) => {
    // Vercel handlers expect (req, res) with .query, .body, .cookies, etc.
    // Express provides all of these, so we can just pass them through.
    return handler(req, res);
  };
}

// Mount each API route
app.all('/api/info', vercelToExpress(infoHandler));
app.all('/api/logout', vercelToExpress(logoutHandler));
app.all('/api/discord-login', vercelToExpress(discordLoginHandler));
app.all('/api/discord-callback', vercelToExpress(discordCallbackHandler));

app.listen(port, () => {
  console.log(`Local API dev server running at http://localhost:${port}/api/`);
});
