let port = process.env.PORT || 3001;

// for random port
if (process.env.NODE_ENV === 'test') {
  port = 0;
}

module.exports = {
  port,
  env: process.env.NODE_ENV || 'development',
  apiUrl: `http://localhost:${port}/api`,
  urls: {
    fromEmail: 'medmcqau@gmail.com',
    resetPassword: '/nyt-kodeord/',
    forgotPassword: '/glemt-kodeord/'
  }
};
