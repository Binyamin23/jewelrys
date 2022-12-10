const express = require("express");
const router = express.Router();
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { auth } = require("../middleWares/auth");


router.get("/", async (req, res) => {
  res.json({ msg: "Users work" });
})


router.get("/myInfo", auth, async (req, res) => {
  try {
    let data = await UserModel.find({ _id: req.tokenData._id }, { password: 0 }) // password:0=>send everything except the password 
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.post("/signUp", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details); // 400=> client error
  }
  try {
    let user = new UserModel(req.body);
    user.password =await bcrypt.hash(user.password, 10); // encrypt the password
    await user.save();
    user.password = "*****";
    res.status(201).json(user)
  }
  catch (err) {
    if (err.code == 11000) { // check unike email
      return res.status(401).json({ msg: "Email already in system, try log in", code: 11000 })
    }
    console.log(err);
    res.status(500).json(err); // 500=> server error
  }
})


router.post("/signIn", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details); // 400=> client error
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email }) // findone=> check , if email not found return null
    if (!user) {
      return res.status(401).json({ msg: "User or password not match , code:1" })
    }
    let passordValid = await bcrypt.compare(req.body.password, user.password) // compare the password
    if (!passordValid) {
      return res.status(401).json({ msg: "User or password not match , code:2" }) // 401=> security error
    }
    let token = createToken(user._id);
    res.json({ token: token });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;