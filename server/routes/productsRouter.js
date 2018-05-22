const router = require("express").Router();

const categoryModel = require("../database/models/categoryModel");


router.route("/categories")
      .get(async (req,res) => {
        try {
          let allCategories = await categoryModel.find();
          res.json({
            message : "success",
            value : allCategories
          });
        } catch(e) {
          res.status(400).json({
            message : "failure",
            value : e.toString()
          });
        }
      })
      .post(async (req,res) => {
        try {
          let newCategory = new categoryModel();
          newCategory.name = req.body.name;
          newCategory = await newCategory.save();
          res.json({
            message : "success",
            value : newCategory
          });
        } catch (e) {
          res.status(400).json({
            message : "failure",
            value : e.toString()
          });
        }
      })

module.exports = router;
