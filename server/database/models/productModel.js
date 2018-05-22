const mongoose = require("mongoose");

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
  image : String,
  title : String,
  description : String,
  price : Number
});

const productModel = mongoose.model("product",productSchema);


module.exports = categoryModel;
