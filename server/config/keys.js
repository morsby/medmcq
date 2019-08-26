const { env } = require('./vars');

// TODO: Tilføj if prod/dev
let keys;
if (env === 'development') {
  keys = require('./dev');
} else {
  keys = require('./prod');
}

module.exports = { ...keys };
