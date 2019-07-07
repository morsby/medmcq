const Keygrip = require('keygrip');
const secrets = process.env.KEYGRIP_SECRETS.split(' ');

const dbConnection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB
};

module.exports = {
  secretKeys: Keygrip(secrets),
  dbConnection: dbConnection
};
