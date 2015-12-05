// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

var express        = require("express")
  , MongoClient  = require("mongodb").MongoClient
  , cons         = require("consolidate")
  , routes       = require("./routes")
  , cookieParser = require("cookie-parser")
  , path         = require("path")
  , app          = express();

MongoClient.connect("mongodb://localhost:27017/crawler", function(err, db) {
    "use strict";
    if(err) throw err;

    app.engine("html", cons.swig);

    app.set("view engine", "html");

    app.use(express.static(path.join(__dirname, 'public')));

    app.set("views", __dirname + "/views");

    app.use(cookieParser());

    routes(app, db);

    app.listen(3000);

    console.log("Express server listening on port 3000");
});
