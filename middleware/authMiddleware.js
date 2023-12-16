const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization
  // console.log(token)
 if (token===null) {
  return res.sendStatus(401);
}
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, 'token', (err, decoded) => {
    if (err) {
      console.log("Token verification failed:");
      return res.sendStatus(403);
    }
   
    req.user = decoded.ref_id; // Save decoded user information in the request object
    // console.log(req.user)
    next();
  });
}

module.exports = { authenticateToken };
