const { env } = require('./vars');

let keys;
if (env === 'production' || env === 'travis') {
  keys = require('./prod');
} else {
  keys = require('./dev');
} else {
  keys = require('./prod');
}

module.exports = { ...keys };
