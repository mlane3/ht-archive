/*
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


var express      = require("express")
  , read         = require("read")
  , pg           = require("pg")
  , cons         = require("consolidate")
  , routes       = require("./routes")
  , cookieParser = require("cookie-parser")
  , path         = require("path")
  , app          = express();

user_input = {
    "usr": "",
    "host": "",
    "port": "",
    "db": "",
    "pwd": ""
};

var i = 2;
var argv = process.argv;
var new_len = argv.length - 1;
while(i < new_len) {
    var arg = argv[i].replace("--", "");
    if(arg in user_input) {
        user_input[arg] = argv[i + 1];
    } else {
        throw Error("Could not parse user input: " + argv[i]);
    }
    i += 2;
}

runServer = function(err, pwd) {
    var usr = user_input["usr"];
    var url = "postgres://" + usr + ":" + pwd + "@" + user_input["host"] + "/" + user_input["db"] + "?ssl=true";
    pg.connect(url, function(err, client, done) {
        "use strict";

        if(err) {
            return console.error('error fetching client from pool', err);
        }

        app.engine("html", cons.swig);

        app.set("view engine", "html");

        app.use(express.static(path.join(__dirname, 'public')));

        app.set("views", __dirname + "/views");

        app.use(cookieParser());

        var daos = require("./routes/daos");
        var searchDAO = new daos.SearchDAO(client);
        routes(app, client);

        app.listen(8080);

        console.log("Express server listening on port 8000");
    });
}

if(!user_input["pwd"]) {
    read({"prompt": "Password: ", "silent": true}, function(err, pwd) {
        runServer(err, pwd);
    });
} else {
    runServer(null, user_input["pwd"]);
}
