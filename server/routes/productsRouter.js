const router = require("express").Router();
const {_STRIPE} = require("../configuration/config");
const stripe = require("stripe")(_STRIPE.secretKey);
const categoryModel = require("../database/models/categoryModel"),
      productModel = require("../database/models/productModel"),
      reviewModel = require("../database/models/reviewModel"),
      orderModel = require("../database/models/orderModel");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");


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
                                      .deepPopulate("reviews.owner")
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
    let product = await productModel.findById(req.params.id).populate("owner").populate("category").deepPopulate("reviews.owner").exec();
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
    let productsPerPage = 10;
    let pageNum = req.query.page || 0;

    let products = await productModel.find()
                  .skip(productsPerPage * pageNum)
                  .limit(productsPerPage)
                  .populate("category")
                  .populate("reviews")
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
});

router.post("/review", authenticationMiddleware, async (req,res) => {
  try {
    let product = await productModel.findById(req.body.productId);
    if(product){
      let review = new reviewModel();
      review.owner = req.userData._id;
      review.title = req.body.title || "";
      review.description = req.body.description || "";
      review.rating = req.body.rating || 0;
      product.reviews.push(review._id);
      await product.save();
      await review.save();
      res.json({
        message : "success",
        review
      });
    } else {
      throw new Error("product not found");
    }
  } catch (e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    })
  }
});

router.post("/payment", authenticationMiddleware, (req,res) => {
  const stripeToken = req.body.stripeToken;
  const currentCharges = Math.round(req.body.totalPrice * 100);

  stripe.customers
    .create({
      source : stripeToken.id
    })
    .then(function(customer){
      return stripe.charges.create({
        amount : currentCharges,
        currency : "usd",
        customer : customer.id
      });
    })
    .then(async function(charge){
      const products = req.body.products;

      let order = new orderModel();
      order.owner = req.userData._id;
      order.totalPrice = currentCharges;

      products.map(product => {
        order.products.push({
          product : product.product,
          quantity : product.quantity
        });
      });

      await order.save();
      res.json({
        message : "success",
        value : order
      });
    }).catch(e => {
      res.json({
        message : "failure",
        value : e.toString()
      });
    });
});

module.exports = router;
