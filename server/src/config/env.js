require('dotenv').config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT',
  'CLIENT_URL',
  'MIRURO_API_URL'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const config = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  clientUrl: process.env.CLIENT_URL.split(',').map((url) => url.trim()),
  miruroApiUrl: process.env.MIRURO_API_URL
};

module.exports = { config };