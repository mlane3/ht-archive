/* 
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


function SearchDAO(client) {

    this.getAreas = function(cb) {
        "use strict";

        var q = "SELECT DISTINCT ON (name) name,id FROM backpagesite ORDER BY name";
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
        console.log("getBackpageQuery page: " + page);
        if(text) {
            if(qs != "") {
                qs += "&";
                q += " AND "
            }
            text = text.replace(/;/g, "");
            // TODO: Sanitize input
            //text = text.replace(/\s+/g, " | ");
            //text = text.replace(/\| and \|/g, "&");
            q += "backpagecontent.textsearch @@ to_tsquery('" + text + "')"
            qs += "text=" + text;
        }
        if(phone) {
            if(qs != "") {
                qs += "&";
                q += " AND "
            }
            q += "backpagephone.number = " + phone.replace(phone_re, "'$1$2$3'");
            tables += " LEFT JOIN backpagephone ON backpagepost.id = backpagephone.backpagepostid"
            qs += "phone=" + phone;
        }
        if(email) {
            if(qs != "") {
                qs += "&";
                q += " AND ";
            }
            tables += " LEFT JOIN backpageemail ON backpagepost.id = backpageemail.backpagepostid"
            q += "backpageemail.name = '" + email + "'";
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
        q += " ORDER BY backpagepost.postdate DESC LIMIT 20 OFFSET " + (page * 20) + ";";
        console.log(tables + " WHERE " + q);

        client.query(tables + " WHERE " + q, [], function(err, result) {
            if(err) cb(err, null, null);
            if(!result) cb(err, null, null);

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
