const express = require('express');
const dotenv = require('dotenv');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const envHandler = require('./env');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const edgeConfigHandler = require('./edge-config');

dotenv.config();
const app = express();
const port = 4000;

// CORS middleware
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/api/env', (req: any, res: any) => envHandler(req, res));
app.get('/api/edge-config', (req: any, res: any) => edgeConfigHandler(req, res));

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});