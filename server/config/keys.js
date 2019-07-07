const { env } = require('./vars');

// TODO: Tilføj if prod/dev
let keys;
if (env === 'prod') {
  keys = require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
