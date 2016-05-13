/*
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


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

    // app.get("/login", seshHandler.displayLogin);
    // app.post("/login", jsonParser, urlencodedParser, seshHandler.handleLogin);
    //
    // app.get("/logout", seshHandler.displayLogout);

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
