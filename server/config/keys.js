const { env } = require('./vars');

let keys;
if (env === 'production') {
  keys = require('./prod');
} else if (env === 'travis') {
  keys = require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
