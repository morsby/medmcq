const { env } = require('./vars');

let keys;
if (env === 'production' || env === 'travis') {
  keys = require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
