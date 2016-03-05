// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

function SearchDAO(client) {

    this.getAreas = function(cb) {
        "use strict";

        var q = "SELECT * FROM backpagesite";
        client.query(q, [], function(err, result) {
            if(err) cb(err, null);

            var rows = result["rows"];
            cb(null, rows);
        });
    }

    this.getBackpageQuery = function(text, phone, email, area, page, cb) {
        "use strict";
        var qs = "";
        var tables = "SELECT page.id,backpagecontent.title,backpagepost.*,backpagesite.name,COUNT(*) OVER() AS total FROM page LEFT JOIN backpagepost ON page.id = backpagepost.pageid LEFT JOIN backpagecontent ON backpagepost.id = backpagecontent.backpagepostid LEFT JOIN backpagesite ON backpagesite.id = backpagepost.backpagesiteid"
        var q = "";
        var phone_re = /(\d{3})\W*(\d{3})\W*(\d{4})/;
        if(text) {
            if(qs != "") {
                qs += "&";
                q += " AND "
            }
            text = text.replace(/;/g, "");
            text = text.replace(/\s+/g, " | ");
            console.log(text);
            text = text.replace(/\| and \|/g, "&");
            console.log(text);
            q += "backpagecontent.textsearch @@ to_tsquery('" + text + "')"
            qs += "text=" + text;
        }
        if(phone) {
            if(qs != "") {
                qs += "&";
                q += " AND "
            }
            q += "backpagephone.number = " + phone.replace(phone_re, "'$1-$2-$3'");
            tables += " LEFT JOIN backpagephone ON backpagepost.id = backpagephone.backpagepostid"
            qs += "phone=" + phone;
        }
        if(email) {
            if(qs != "") {
                qs += "&";
                q += " AND ";
            }
            tables += " LEFT JOIN backpageemail ON backpagepost.id = backpageemail.backpagepostid"
            q += "backpagephone.email = '" + email + "'";
            qs += "email=" + email;
        }
        if(area) {
            if(qs != "") {
                qs += "&";
                q += " AND ";
            }
            q += "backpagepost.backpagesiteid = " + area;
            qs += "area=" + area;
        }
        if(qs != "") {
            qs += "&";
        } else {
            q = " TRUE"
        }
        qs += "page=" + page;
        q += " ORDER BY page.id DESC LIMIT 20 OFFSET " + (page * 20) + ";"

        client.query(tables + " WHERE " + q, [], function(err, result) {
            if(err) cb(err, null, null);

            cb(null, qs, result["rows"]);
        });
    }

    this.getBackpagePost = function(id, cb) {
        var q = "SELECT * FROM page LEFT JOIN backpagepost ON page.id = backpagepost.pageid LEFT JOIN backpagecontent ON backpagepost.id = backpagecontent.backpagepostid WHERE page.id = $1"
        client.query(q, [id], function(err, result) {
            if(err) cb(err, null);
            cb(null, result["rows"][0]);
        });
    }
}

module.exports.SearchDAO = SearchDAO
