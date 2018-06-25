const router = require("express").Router();

const {_AMAZON} = require("../configuration/config");

const productModel = require("../database/models/productModel"),
      categoryModel = require("../database/models/categoryModel"),
      userModel = require("../database/models/userModel"),
      authenticationMiddleware = require("../middlewares/authenticationMiddleware");

const aws = require("aws-sdk"); // comunication with services
const multer = require("multer"); // uploading images
const multerS3 = require("multer-s3"); // uploading images directlu to s3 bucket
const s3 = new aws.S3({ accessKeyId: _AMAZON.accessKeyId, secretAccessKey: _AMAZON.secretAccessKey });

const faker = require("faker");
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

router.get("/faker",async (req,res) => {
  let user = await userModel.findOne({name : "Szymon"});
  if(!user){
    res.send("aaaaa");
    return;
  }
  for(let i=0;i<10;i++){
    let newCategory = new categoryModel();
    newCategory.name = faker.commerce.department();
    let otherCategory = await categoryModel.findOne({name : newCategory.name});
    if(otherCategory){continue};
    await newCategory.save();
    for(let j=0;j<20;j++){
      let newProduct = new productModel();
      newProduct.category = newCategory._id;
      newProduct.owner = user._id;
      newProduct.image = faker.image.transport();
      newProduct.title = faker.commerce.productName();
      newProduct.description = faker.lorem.words();
      newProduct.price = faker.commerce.price();
      await newProduct.save();
    };
  };
  res.send("populated");
})


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
            products : products,
            success : true
          })
        } catch (e) {
          res.json({
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
            product : product,
            success : true
          })
        } catch (e) {
          res.json({
            message : "Successfully added new product !",
            success : false
          })
        }
      });

module.exports = router;
