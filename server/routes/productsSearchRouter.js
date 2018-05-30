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
        message : "success",
        content : result,
        searchKey : req.query.query
      });

    } catch(e) {
      res.status(400).json({
        message : "failure",
        value : e.toString()
      })
    }
  } else {
    res.status(404).json({
      message : "failure",
      value : "query not present"
    })
  }
});

module.exports = router;
