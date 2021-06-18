const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../MiddlewareHelpers");
const JWT = require("jsonwebtoken");

//this route should fire upon signing in in order to prepare the home page in front-end
router.get("/", isLoggedIn, async (req, res) => {
  const payload = JWT.decode(req.signedCookies.AuthCookie, { json: true });
  console.log("logged in user id:", payload.id);

  //return list of projects that the user contributes to

  return res.send("peepee");
});

module.exports = router;
