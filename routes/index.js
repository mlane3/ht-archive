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
  , QueryHandler    = require("./queries")
  , EntityResolutionHandler = require("./entityresolution");

module.exports = exports = function(app, client) {
    var urlencodedParser = bodyParser.urlencoded({ extended: false });

    var jsonParser = bodyParser.json();

    var seshHandler   = new SeshHandler(client);
    var searchHandler = new SearchHandler(client);
    var queryHandler = new QueryHandler(client);
    var entityResolutionHandler = new EntityResolutionHandler(client);

    // app.use(seshHandler.isLoggedInMiddleware);

    // app.get("/login", seshHandler.displayLogin);
    // app.post("/login", jsonParser, urlencodedParser, seshHandler.handleLogin);
    //
    // app.get("/logout", seshHandler.displayLogout);

    // api
    app.get("/api/backpage/entities", queryHandler.getAllEntities);
    app.get("/api/backpage/entities/get/:id", queryHandler.getEntityById);
    app.get("/api/backpage/entities/resolve", queryHandler.searchEntities);

    app.get("/welcome", seshHandler.displayWelcome);

    app.get("/signup", seshHandler.displaySignup);
    app.post("/signup", urlencodedParser, seshHandler.handleSignup);

    app.get("/search", urlencodedParser, searchHandler.displayQuery);
    app.post("/search", urlencodedParser, searchHandler.handleQuery);

    app.get("/show", urlencodedParser, searchHandler.parseShow, searchHandler.displayShow);
    app.post("/show", urlencodedParser, searchHandler.handleShow, searchHandler.displayShow);

    app.get("/", urlencodedParser, searchHandler.displaySearch);
    app.get("/entityresolution",
        urlencodedParser,
        entityResolutionHandler.get);
}
