const express = require("express");
const router = express.Router();
const Feature = require("../Models/Feature");
const Project = require("../Models/Project");

//Feature Routes
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
  // await Feature.findById(req.params.id, (err, res) => {
  //   if (err || !res) {
  //     return response.status(404).send("no data found" + err);
  //   }
  //   return response.status(200).send(res);
  // });
  Feature.findById(req.params.id)
    //fill tasks reference with actual tasks
    .populate("tasks")
    .exec((err, result) => {
      if (err) return res.status(404).send(err);
      return res.status(200).send(result);
    });
});

//create
//requires Project Id
router.post("/", async (req, response) => {
  //new feature from request
  const feature = {
    name: req.body.name,
    priority: req.body.priority,
    status: req.body.status,
  };
  const newfeature = new Feature(feature);
  // save feature
  await newfeature.save((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    //add reference in Project.features
    Project.findByIdAndUpdate(
      req.body.projectId,
      {
        $push: { features: result._id },
      },
      (err, res) => {
        if (err) response.status(400).send(err);
        return response.status(200).send(result);
      }
    );
  });
});

//delete one
router.delete("/:id", async (req, response) => {
  await Feature.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted" + res);
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
        return response.status(404).send(err);
      }
      return response.status(200).send("document updated");
    }
  );
});

module.exports = router;
