//£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££ TEST THIS ££££££££££££££££££££££££££££££££££££££££££££££££££££££
const express = require("express");
const router = express.Router();
const Feature = require("../Models/Feature");
const Task = require("../Models/Task");

//Task Routes
//get all
router.get("/", async (req, res) => {
  try {
    await Task.find().then((data) => {
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, response) => {
  await Task.findById(req.params.id, (err, res) => {
    if (err || !res) {
      return response.status(404).send("no data found" + err);
    }
    return response.status(200).send(res);
  });
});

//create
//requires Feature Id
router.post("/", async (req, response) => {
  //new task from request
  const task = {
    name: req.body.name,
    status: req.body.status,
    category: req.body.category,
  };
  const newtask = new Task(task);
  // save task
  await newtask.save((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    //add reference in Feature.tasks
    Feature.findByIdAndUpdate(
      req.body.featureId,
      {
        $push: { tasks: result._id },
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
  //remove reference
  await Feature.update({},{
    $pull : {features : req.params.id}
  });
  //remove document
  await Task.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted" + res);
  });
});

//update
router.put("/:id", async (req, response) => {
  await Task.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      status: req.body.status,
      category: req.body.category,
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
