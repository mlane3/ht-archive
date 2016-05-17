var cheerio = require("cheerio");

function EntityResolutionHandler(client) {

  var get = function(req, res, next) {
    res.render("entityresolution");
  }

  return {
    get: get
  };
}

module.exports = EntityResolutionHandler;
