//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  password safety + add project route $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

//validation schema
const schema = Joi.object({
  name: Joi.string().min(6).required().error(()=>{return {message: "name required"}}),
  email : Joi.string().min(6).required().email(),
  password : Joi.string().min(8).required(),
  role : Joi.string().valid("Dev","Tester","Manager","Admin")
})

//User Routes
//get all
router.get("/", async (req, res) => {
  try {
    await User.find().then((data) => {
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, res) => {
  //populate projects before sending for ease of access
  User.findById(req.params.id)
    //fill projects reference with actual projects
    .populate("projects")
    .exec((err, result) => {
      if (err) return res.status(404).send(err);
      return res.status(200).send(result);
    });
});

//create
router.post("/", async (req, res) => {
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
  if(validation.error){
    return res.status(401).send(validation.error.details[0].message)
  }
  const newUser = new User(user);
  //check if user exists 
  const search= await User.findOne({email : user.email}).exec()
  if(search){
    return res.status(422).send("email already exists")
  }
  //if doesnt exist we save
  await newUser.save((err) => {
    if (err) {
      return res.send(err);
    }
  });
  return res.status(200).send("User saved");

});

//delete one
router.delete("/:id", async (req, response) => {
  await Project.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted");
  });
});

//update
router.put("/:id", async (req, response) => {
  await User.findByIdAndUpdate(
    req.params.id,
    { 
        name: req.body.name,
        email: req.body.email,
        //PLACEHOLDER
        password : req.body.password,
        role : req.body.role
    },
    (err, res) => {
      if (err) {
        return response.status(404).send(err);
      }
      return response.status(200).send("document updated");
    }
  );
});

module.exports = router;
