const { env } = require('./vars');

// TODO: Tilføj if prod/dev
let keys;
if (env === 'production') {
  keys = require('./prod');
} else if (env === 'test') {
  keys = require('./dev') || require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
