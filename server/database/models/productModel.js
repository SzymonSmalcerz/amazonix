const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseAlgolia = require("mongoose-algolia");
const {_ALGOLIA} = require("../../configuration/config");
const productSchema = new mongoose.Schema({
  category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "category"
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  },
  created : {
    type : Date,
    default : Date.now
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

// console.log(_ALOGLIA);
productSchema.plugin(deepPopulate);
productSchema.plugin(mongooseAlgolia,{
  appId:_ALGOLIA.apiId,
  apiKey:_ALGOLIA.apiKey,
  indexName:_ALGOLIA.indexName, //The name of the index in Algolia, you can also pass in a function
  selector : '_id title image reviews description price owner created averageRating',
  populate : {
    path : 'owner reviews',
    select : 'name rating'
  },
  defaults : {
    author : 'SzymonSmalcerz'
  },
  mappings : {
    title : function(value) {
      return `${value}`;
    }
  },
  virtuals : {},
  debug : true
});
const productModel = mongoose.model("product",productSchema);
productModel.SyncToAlgolia();
productModel.SetAlgoliaSettings({
  searchableAttributes : ['title']
});

module.exports = productModel;
