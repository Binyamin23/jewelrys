const express = require("express");
const router = express.Router();
const { validateJewelrys, JewelrysModel } = require("../models/jewelryModel")
const { auth } = require("../middleWares/auth")


router.get("/", async (req, res) => {
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await JewelrysModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/search", async (req, res) => {
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let queryS = req.query.s;
    let reqQuery = new RegExp(queryS, "i");
    let data = await JewelrysModel
      .find({ $or: [{ name: reqQuery }, { info: reqQuery }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/category/:urlCode", async (req, res) => {
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let urlCode = req.params.urlCode;
    let regUrlCode = new RegExp(urlCode, "i");
    let data = await JewelrysModel
      .find({ category: regUrlCode })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/prices", async (req, res) => {
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let min = req.query.min || 1;
  let max = req.query.max || 999;
  try {
    let data = await JewelrysModel
      .find({ price: { $lte: max, $gte: min } })         // lte=> less than equal , gte=> big than equal
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/myList", auth,async(req,res) => {
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try{  
    let data = await JewelrysModel
    .find({user_id:req.tokenData._id})
    .limit(perPage)
    .skip((page-1) * perPage )
    .sort({[sort]:reverse})
    res.json(data); 
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})


router.post("/", auth, async (req, res) => {
  let validBody = validateJewelrys(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let jewelry = new JewelrysModel(req.body);
    jewelry.user_id = req.tokenData._id
    await jewelry.save();
    res.status(201).json(jewelry)
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})


router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validateJewelrys(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await JewelrysModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await JewelrysModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


module.exports = router;


//localhost:3002/jewelrys/prices?min=300&max=600&sort=price&reverse=yes


