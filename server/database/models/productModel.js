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
  title : String,
  description : String,
  price : Number
},{
  toObject : { virtuals : true },
  toJSON : { virtuals : true }
});

productSchema.virtual("averageRating")
             .get(function(){
               let avgRating = 0;
               let reviewsNum = this.reviews.length;
               if(reviewsNum > 0){
                 avgRating = this.reviews.reduce((t,v) => t+v.rating,0)/reviewsNum;
               }
               return avgRating;
             });
productSchema.plugin(deepPopulate);
const productModel = mongoose.model("product",productSchema);


module.exports = productModel;
