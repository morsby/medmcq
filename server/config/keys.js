const { env } = require('./vars');

// TODO: Tilføj if prod/dev
let keys;
if (env === 'production' || env === 'github') {
  keys = require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
