const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("../MiddlewareHelpers");


//login
router.post("/login", async (req, res) => {
  //get input
  const credentials = { email: req.body.email, password: req.body.password };

  //attempt to find corresponding user
  await User.findOne({ email: credentials.email }, (err, doc) => {
    if (err || !doc) return res.send(JSON.stringify({msg:`password or email mismatch`,success:false}));
    //if found we compare posswords
    bcrypt.compare(credentials.password, doc.password, (err, result) => {
      if (err) return res.send(err);
      if (result) {
        //sign JWT if everything matches 
        const accessToken = jwt.sign(
            { id: doc._id, role: doc.role },
            `${process.env.JWT_SECRET_KEY}`
          );
          console.log(accessToken)
          //send
          res.cookie("AuthCookie",accessToken,{
            expires: new Date(Date.now()+ 900000),
            httpOnly : false,
            signed : true
          })
          res.cookie("id",doc._id.toString())
          res.cookie("role",doc.role)
          res.send(JSON.stringify({msg:`welcome ${doc.name}`,success:true}));
      } else {
        return res.send(JSON.stringify({msg:`password or email mismatch`,success:false}));
      }
    });
  });
});

//logout
router.get("/logout",isLoggedIn,(req,res)=>{
  res.cookie("AuthCookie", {
    expires: "Thu, 01 Jan 1970 00:00:01 GMT;",
    httpOnly: false, //change this later
    signed:true
  });
  res.cookie("role", {
    expires: "Thu, 01 Jan 1970 00:00:03 GMT;",
    httpOnly: false,
    signed:false
  });
  res.send(JSON.stringify({msg:"you have been logged out"}))
})
//validation schema
const schema = Joi.object({
  name: Joi.string()
    .min(6)
    .required()
    .error(() => {
      return { message: "name required" };
    }),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("Admin","Member"),
});

//create
router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  };
  //check for validation
  const validation = schema.validate(user);
  if (validation.error) {
    return res.status(401).send(validation.error.details[0].message);
  }
  const newUser = new User(user);
  //check if user exists
  const search = await User.findOne({ email: user.email }).exec();
  if (search) {
    return res.status(422).send("email already exists");
  }
  //if doesnt exist we save
  await newUser.save((err) => {
    if (err) {
      return res.send(err);
    }
  });
  return res.status(200).send("User saved");
});

module.exports = router;
