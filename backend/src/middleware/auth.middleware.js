const jwt = require('jsonwebtoken');

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all the future routes, this helps to know if the request is authenticated or not.
const checkAuth = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[auth.middleware] -> [checkAuth] error ', err);
      return res.status(401).json({
        error: 'AUTHORIZATION_ERROR'
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
};

const authRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      error: 'Authorization required!'
    });
  }
};
const adminAuthRequired = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(401).json({
      error: 'Admin access required!'
    });
  }
};

module.exports = {
  checkAuth,
  authRequired,
  adminAuthRequired
};