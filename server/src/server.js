require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();

  server.listen(config.port, 'localhost', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
    console.log(`Server URL: http://localhost:${config.port}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

startServer();