const router = require("express").Router();

const {_ALGOLIA} = require("../configuration/config");
const algoliaSearch = require("algoliasearch");
const client = algoliaSearch(_ALGOLIA.apiId, _ALGOLIA.apiKey);
const index = client.initIndex(_ALGOLIA.indexName);

router.get("/",async (req,res) => {
  if(req.query.query) {
    try {
      let result = await index.search({
        query : req.query.query,
        page : req.query.page || 0
      });

      res.json({
        success : true,
        message : "found some results",
        content : result,
        status : 200,
        search_result : req.query.query
      });

    } catch(e) {
      res.json({
        success : false,
        message : e.toString()
      });
    }
  } else {
    res.json({
      success : false,
      message : e.toString()
    });
  }
});

module.exports = router;
