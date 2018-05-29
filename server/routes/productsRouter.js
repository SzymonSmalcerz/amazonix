const router = require("express").Router();

const categoryModel = require("../database/models/categoryModel"),
      productModel = require("../database/models/productModel");


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
      });

router.get("/categories/:id",async (req,res) => {
  try {
    let productsPerPage = 10;
    let pageNum = req.query.page;

    let products = await productModel.find({category : req.params.id})
                                      .skip(productsPerPage * pageNum)
                                      .limit(productsPerPage)
                                      .populate("category")
                                      .populate("owner")
                                      .exec();
    let productsCount = await productModel.count({category : req.params.id});

    res.json({
      message : "success",
      products : products,
      categoryName : products[0].category.name,
      productsCount : productsCount,
      pages : Math.ceil(productsCount / productsPerPage)
    });
  }  catch (e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    })
  };

});

router.get("/:id", async(req,res) => {
  try {
    let product = await productModel.findById(req.params.id).populate("owner").populate("category").exec();
    res.json({
      message : "success",
      value : product
    });
  } catch (e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    })
  }
});


router.get("/", async(req,res) => {
  try {
    console.log(req.query);
    let productsPerPage = 10;
    let pageNum = req.query.page || 0;

    let products = await productModel.find()
                  .skip(productsPerPage * pageNum)
                  .limit(productsPerPage)
                  .populate("category")
                  .populate("owner")
                  .exec();
    let productsCount = await productModel.count();

    res.json({
      message : "success",
      products : products,
      productsCount : productsCount,
      pages : Math.ceil(productsCount / productsPerPage)
    });
  } catch (e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    })
  }
})

module.exports = router;
