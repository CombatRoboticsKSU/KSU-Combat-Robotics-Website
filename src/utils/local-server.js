require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const apiDir = path.join(__dirname, '../../api');
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!url) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL must be set and include a port');
}
const PORT = new URL(url).port;

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/api/:handler', async (req, res) => {
  const handlerName = req.params.handler;
  if (handlerName === 'bot') {
    return res.status(204).end(); // Do nothing, bot.js is managed elsewhere
  }
  const handlerPath = path.join(apiDir, `${handlerName}.js`);
  if (fs.existsSync(handlerPath)) {
    // Clear require cache for hot-reloading during development
    delete require.cache[require.resolve(handlerPath)];
    const handler = require(handlerPath);
    // If the handler exports a function, call it as (req, res)
    if (typeof handler === 'function') {
      return handler(req, res);
    } else {
      res.status(500).send('API handler does not export a function');
    }
  } else {
    res.status(404).send('API handler not found');
  }
});

app.listen(PORT, () => {
  console.log(`Local API server running at http://localhost:${PORT}/api/`);
});
