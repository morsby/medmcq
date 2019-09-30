let port = process.env.PORT || 3001;

// for random port
if (process.env.NODE_ENV === 'test') {
  port = 0;
}

const env = process.env.NODE_ENV || 'development';

module.exports = {
  port,
  env,
  apiUrl: `http://localhost:${port}/api`,
  urls: {
    fromEmail: 'medmcqau@gmail.com',
    resetPassword: '/nyt-kodeord/',
    forgotPassword: '/glemt-kodeord/',
    dev: env === 'development' ? 'localhost:3000' : false,
    issue: 'medmcq@fire.fundersclub.com'
  }
};
