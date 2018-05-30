const router = require("express").Router();

const {_AMAZON} = require("../configuration/config");

const productModel = require("../database/models/productModel"),
      authenticationMiddleware = require("../middlewares/authenticationMiddleware");

const aws = require("aws-sdk"); // comunication with services
const multer = require("multer"); // uploading images
const multerS3 = require("multer-s3"); // uploading images directlu to s3 bucket
const s3 = new aws.S3({ accessKeyId: _AMAZON.accessKeyId, secretAccessKey: _AMAZON.secretAccessKey });

// creating a storage !!!!
const upload = multer({
  storage : multerS3({
    s3 : s3, //connection to bucket
    bucket : _AMAZON.bucketName, //name of the bucket
    metadata : function(req,file,callback){ // information related to file
      callback(null,{fieldName : file.fieldname});
    },
    key : function(req,file,callback){ // name of the uploaded file
      callback(null,Date.now().toString());
    }
  })
});

router.route("/products")
      .get(authenticationMiddleware,async (req,res) => {
        try {
          let products = await productModel.find({owner : req.userData._id})
                                .populate("owner")
                                .populate("category")
                                .populate("reviews")
                                .exec();
          res.json({
            message : "success",
            value : products
          })
        } catch (e) {
          res.status(400).json({
            message : "failure",
            value : e.toString()
          })
        }
      }) // upload.single('product_picture') => upload one picture and give it a name "product_picture"
      .post([authenticationMiddleware, upload.single("product_picture")],async (req,res) => {
        try {
          let product = new productModel();
          product.owner = req.userData._id;
          product.category = req.body.categoryId;
          product.title = req.body.title;
          product.price = req.body.price || 3000;
          product.description = req.body.description;
          product.image = req.file.location;
          product = await product.save();
          res.json({
            message : "success",
            product
          })
        } catch (e) {
          res.status(400).json({
            message : "failure",
            value : e.toString()
          })
        }
      });

module.exports = router;
