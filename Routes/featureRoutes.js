// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$todo$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const express = require("express");
const router = express.Router();
const Feature = require("../Models/Feature");
const Project = require("../Models/Project");

//Project Routes
//get all
router.get("/", async (req, res) => {
  try {
    await Feature.find().then((data) => {
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, response) => {
  await Feature.findById(req.params.id, (err, res) => {
    if (err || !res) {
      return response.send("no data found" + err).status(404);
    }
    return response.send(res).status(200);
  });
});


//#################################### test this ########################################
//create
router.post("/", async (req, res) => {
  const feature = {
    name: req.body.name,
    priority: req.body.priority,
    status: req.body.status,
  };
  const newfeature = new Feature(feature);
  await newfeature.save((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    // Project.findByIdAndUpdate(
    //   req.projectId,
    //   { $push: { features: result._id } },
    //   { new: true, useFindAndModify: false },
    //   (err, success) => {
    //     if (err) res.status(400).send(err);
    //     return res.status(200).send(success);
    //   }
    // );
    Project.findById(req.body.projectId)
      .populate("features")
      .exec((err, result) => {
        if (err) return res.send(err);
        res.status(200).send(result);
      });
  });
});

//delete one
router.delete("/:id", async (req, response) => {
  console.log(req.params.id);
  await Feature.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.send(err).status(404);
    }
    return response.send("document deleted" + res).status(200);
  });
});

//update
router.put("/:id", async (req, response) => {
  await Feature.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      priority: req.body.priority,
      status: req.body.status,
    },
    (err, res) => {
      if (err) {
        return response.send(err).status(404);
      }
      return response.send("document updated").status(200);
    }
  );
});

module.exports = router;