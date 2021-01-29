const { Router } = require("express");
const express = require("express")
const router = express.Router();
const Project = require("../Models/Project")

//Project Routes
router.get('/Projects',(req,res)=>{
    res.send("your projects should be here")
})



// app.get("/animals", (req, res) => {
//     animal
//       .find()
//       .then((data) => {
//         res.json(data);
//       })
//       .catch((err) => {
//         res.json(err);
//       });
//   });

// app.post("/animal", async (req, res) => {
//     console.log(req.body.name);
//     const pet = new animal({ name: req.body.name });
//     await pet.save((err) => {
//       if (err) res.send("error when saving animal");
//       res.send("animal registered");
//     });
//   });

module.exports = router;