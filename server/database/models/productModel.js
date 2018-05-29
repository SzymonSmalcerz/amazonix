const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
// acces key id : AKIAIZK5FS3MKSRVLTNQ
// PaHLv1aaAR7SP8h+kkzVA9TzG85oLgyDjtZMcdKP
const productSchema = new mongoose.Schema({
  category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "category"
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  },
  reviews : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "review"
  }],
  image : String,
  title : {
    type : String,
    default : "aaaaaTest"
  },
  description : String,
  price : Number
});
productSchema.plugin(deepPopulate);
const productModel = mongoose.model("product",productSchema);


module.exports = productModel;
