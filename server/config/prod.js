const Keygrip = require('keygrip');
const secrets = process.env.KEYGRIP_SECRETS.split(' ');

module.exports = {
  secretKeys: Keygrip(secrets),
  sendgridApiKey: process.env.SENDGRID
};
