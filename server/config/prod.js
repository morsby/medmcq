const Keygrip = require('keygrip');
const secrets = process.env.KEYGRIP_SECRETS.split(' ');

const dbConnection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  port: process.env.DB_PORT || 3306
};

module.exports = {
  secretKeys: Keygrip(secrets),
  sendgridApiKey: process.env.SENDGRID,
  dbConnection: dbConnection,
  migrationPass: process.env.MIGRATION_PASS
};
