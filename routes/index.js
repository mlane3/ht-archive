// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

var bodyParser      = require("body-parser")
  , cookieParser    = require("cookie-parser")
  , errorHandler    = require("./error").errorHandler
  , SeshHandler     = require("./session")
  , SearchHandler   = require("./search")
  , DiscoverHandler = require("./discover");

module.exports = exports = function(app, client) {
    var urlencodedParser = bodyParser.urlencoded({ extended: false });

    var jsonParser = bodyParser.json();

    var seshHandler   = new SeshHandler(client);
    var searchHandler = new SearchHandler(client);
    var discoverHandler = new DiscoverHandler(client);

    app.use(seshHandler.isLoggedInMiddleware);

    app.get("/login", seshHandler.displayLogin);
    app.post("/login", jsonParser, urlencodedParser, seshHandler.handleLogin);

    app.get("/logout", seshHandler.displayLogout);

    app.get("/welcome", seshHandler.displayWelcome);

    app.get("/signup", seshHandler.displaySignup);
    app.post("/signup", urlencodedParser, seshHandler.handleSignup);

    app.get("/search", urlencodedParser, searchHandler.displayQuery);
    app.post("/search", urlencodedParser, searchHandler.handleQuery);

    app.get("/show", urlencodedParser, searchHandler.parseShow, searchHandler.displayShow);
    app.post("/show", urlencodedParser, searchHandler.handleShow, searchHandler.displayShow);

    app.get("/", urlencodedParser, searchHandler.displaySearch);
    app.get("/discover", urlencodedParser, discoverHandler.displaySearch);
}
