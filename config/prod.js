const Keygrip = require('keygrip');
module.exports = {
  mongoURI: process.env.MONGO_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  session: process.env.SESSION,
  keys: Keygrip(process.env.SESSION_SECRETS),
  sendgrid_api_key: process.env.SENDGRID_API_KEY
};
