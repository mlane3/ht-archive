/* 
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


var bcrypt = require("bcrypt-nodejs");

function UsrDAO(client) {
    "use strict";

    this.addUsr = function(usr, pass, email, cb) {
        "use strict";

        var salt = bcrypt.genSaltSync();
        var pass_hash = bcrypt.hashSync(pass, salt);

        var q = "INSERT INTO siteusers(name,pass,email,datejoined,roleid) VALUES($1,$2,$3,NOW(),$4);";
        var vals = [usr,pass_hash,email,1];
        client.query(q, vals, function(err, result) {
            "use strict";

            if(err) return cb(err, null);

            return cb(null, result);
        });
    }

    this.validLogin = function(usr, pass, cb) {
        "use strict";

        var q = "SELECT id,name,pass,roleid FROM siteusers WHERE name = $1;";
        client.query(q, [usr], function(err, result) {
            "use strict";

            if(err) return cb(err, null);

            var res = result["rows"][0];
            if(res) {
                if(res["roleid"] == 1) {
                    var not_confirmed = new Error("User not confirmed");
                    not_confirmed.bad_pass = true;
                    return cb(not_confirmed, null);
                } else if(bcrypt.compareSync(pass, res["pass"])) {
                    return cb(null, res);
                } else {
                    var bad_pass_err = new Error("Invalid Password");
                    bad_pass_err.bad_pass = true;
                    return cb(bad_pass_err, null);
                }
            } else {
                var bad_usr_err = new Error("Invalid Username");
                bad_usr_err.bad_usr = true;
                return cb(bad_usr_err, null);
            }
        });
    }

    this.getUserByName = function(usr, cb) {
        "use strict";

        var q = "SELECT * FROM siteusers WHERE name = $1";

        client.query(q, [usr], function(err, result) {
            if(err) return cb(err, null);

            if(result["rows"].length != 1) {
                return cb(Error("Unique userid not found"), null);
            } else {
                return cb(null, result["rows"][0]);
            }
        });
    }
}


module.exports.UsrDAO = UsrDAO
