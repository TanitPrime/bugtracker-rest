const JWT = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  //get token from signed cookies
  let token = req.signedCookies.AuthCookie;
  if (!token) return res.status(403).send("protected route");
  JWT.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send(err);
    }
    //im not sure if i should attach the payload to req
    // req.payload = JWT.decode(token, { json: true });
    // console.log(req.payload);
  });
  next();
};

module.exports = isLoggedIn;
