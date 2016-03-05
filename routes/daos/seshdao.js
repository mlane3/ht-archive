// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

var crypto = require("crypto");

function SeshDAO(client) {
    "use strict";

    this.startSesh = function(usrdata, cb) {
        "use strict";

        var cur_date = (new Date()).valueOf().toString();
        var rand     = Math.random().toString();
        var sesh_id  = crypto.createHash("sha1").update(cur_date + rand).digest("hex");

        var q = "INSERT INTO sitesessions(id, userid, username) VALUES ($1,$2,$3);"
        var vals = [sesh_id, usrdata["id"], usrdata["name"]];
        client.query(q, vals, function(err, res) {
            "use strict";
            cb(err, sesh_id);
        });
    }

    this.endSesh = function(sesh_id, cb) {
        "use strict";
        var q = "DELETE FROM sitesessions WHERE id = $1;";
        var vals = [sesh_id];
        client.query(q, vals, function(err, res) {
            "use strict";
            cb(err, null);
        });
    }

    this.getUsr = function(sesh_id, cb) {
        "use strict";

        if(!sesh_id) {
            cb(new Error("Error: Session not set"), null);
            return;
        }

        var q = "SELECT userid,username FROM sitesessions WHERE id = $1;";
        var vals = [sesh_id];
        client.query(q, vals, function(err, sesh) {
            "use strict";

            if(err) return cb(err, null);

            if(!sesh["rows"]) {
                cb(new Error("Error: session# " + sesh_id + " not found"), null);
                return;
            }

            cb(null, sesh["rows"][0]);
        });
    }
}

module.exports.SeshDAO = SeshDAO;
