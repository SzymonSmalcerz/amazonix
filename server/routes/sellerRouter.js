const router = require("express").Router();


const categoryModel = require("../database/models/categoryModel"),
      authenticationMiddleware = require("../middlewares/authenticationMiddleware");

const aws = require("aws-sdk"); // comunication with services
const multer = require("multer"); // uploading images
const multerS3 = require("multer-s3"); // uploading images directlu to s3 bucket
const s3 = new aws.S3({ accessKeyId: "AKIAIZK5FS3MKSRVLTNQ", secretAccessKey: "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" });


// creating a storage !!!!
var upload = multer({
  storage : multerS3({
    s3 : s3, //connection to bucket
    bucket : "tai-amazonix", //name of the bucket
    metadata : function(req,file,callback){ // information related to file
      callback(null,{fieldName : file.fieldname});
    },
    key : function(req,file,callback){ // name of the uploaded file
      callback(null,Date.now().toString());
    }
  })
});

router.route("/products")
      .get((req,res) => {
        res.send("products hereeee");
      }) // upload.single('product_picture') => upload one picture and give it a name "prodict_picture"
      .post([authenticationMiddleware, upload.single('product_picture')],async (req,res) => {
        try {
          res.send(":)");
          // let product = new categorModel();
          // product.owner = req.userData._id;
          // product.category = req.body.categoryId;
          // product.title = req.body.title;
          // product.price = req.body.price;
          // product.description = req.body.description;
          // product.image = req.file.image;
          // product = await product.save();
          // res.json({
          //   message : "success",
          //   product
          // })
        } catch (e) {
          res.status(400).json({
            message : "failure"
          })
        }
      });

module.exports = router;
