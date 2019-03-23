// Auth middleware, som tjekker at brugeren er logget ind

module.exports = function(req, res, next) {
  const user = req.user;
  if (!user) return res.status(401).send('Not logged in');
  next();
};
