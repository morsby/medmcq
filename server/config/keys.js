const { env } = require('./vars');

console.log(env);

// TODO: Tilføj if prod/dev
let keys;
if (env === 'production') {
  keys = require('./prod');
} else if (env === 'travis') {
  keys = require('./dev') || require('./prod');
} else {
  keys = require('./dev');
}

module.exports = { ...keys };
