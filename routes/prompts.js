const express = require("express");
const router = express.Router();

//used to protect routes
const auth = require("../middleware/auth");
//validation
const { check, validationResult } = require("express-validator");

//models
const Prompts = require("../models/Prompts");
const User = require("../models/User");

//@route    GET api/prompts/all
//@desc     Get all prompts
//@access   Private

// router.get("/all", async (req, res) => {
//   try {
//     //req.user is accessible through the auth middleware      //sorts prompts by most recent date.
//     const prompts = await Prompts.find()
//     res.json(prompts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("server error");
//   }
// });

//===================================

//@route    GET api/prompts
//@desc     Get all users prompts
//@access   Private

router.get("/", auth, async (req, res) => {
  try {
    //pulls all prompts regardless of user
    const prompts = await Prompts.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(prompts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    POST api/prompts
//@desc     Add new prompts
//@access   Private

router.post(
  "/",
  // [
    //protected route
    auth,
    //validation - if any of the checks are false, the error is put into an array. if not array will be empty.
    // [
    //   check("name", "name is required")
    //     .not()
    //     .isEmpty()
    // ]
  // ],
  async (req, res) => {
    // //check for errors in checks array
    // const errors = validationResult(req);
    // //if the array of validation errors is not empty, then show the error message
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { title, response } = req.body;

    try {
      //create a new prompt object
      const newPrompt = new Prompts({
        title,
        response,
        //user id from auth middleware
        user: req.user.id
      });
      const prompt = await newPrompt.save();

      res.json(prompt);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//@route    PUT api/prompts/:id
//@desc     Update prompt
//@access   Private

router.put("/:id", auth, async (req, res) => {
  //destructure data from frontend
  const { title, response} = req.body;

  //build prompt object
  const promptFields = {};
  //if the data exists in the req.body, then we want to copy it to the prompt field object
  
  if (title) promptFields.title = title;
  if (response) promptFields.response = response;

  try {
    //pull prompt by id to see if it exists in db
    let prompt = await Prompts.findById(req.params.id);
    //if it doesn't exists throw error
    if (!prompt) return res.status(404).json({ msg: "prompt not found" });

    //make sure user owns prompt
    if (prompt.user.toString() !== req.user.id) {
      //if the user is not the owner of the prompt, throw error
      return res.status(401).json({ msg: "not authorized" });
    }
    //find prompt by id and update with the data saved to the promptFields object
    prompt = await Prompts.findByIdAndUpdate(
      req.params.id,
      { $set: promptFields },
      { new: true }
    );
    res.json(prompt);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    Delete api/prompts/:id
//@desc     Delete prompt
//@access   Private

router.delete("/:id", auth, async (req, res) => {
  try {
    //pull prompt by id to see if it exists in db
    let prompt = await Prompts.findById(req.params.id);
    //if it doesn't exists throw error
    if (!prompt) return res.status(404).json({ msg: "prompt not found" });

    //make sure user owns prompt
    if (prompt.user.toString() !== req.user.id) {
      //if the user is not the owner of the prompt, throw error
      return res.status(401).json({ msg: "not authorized" });
    }
    //find prompt by id and update with the data saved to the promptFields object
    await Prompts.findByIdAndRemove(req.params.id);

    res.json({ msg: "prompt removed" });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
