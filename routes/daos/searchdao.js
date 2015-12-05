// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

function SearchDAO(db) {
    var search  = db.collection("search");
    var headers = db.collection("headers");

    this.getAreas = function(cb) {
        "use strict";

        headers.findOne({"_id": "areas"}, function(err, areas) {
            cb(null, areas["areas"]);
        });
    }

    this.getQuery = function(text, phone, email, area, cb) {
        var search_doc = {};
        var qs = "";
        var phone_re = /(\d{3})\D*(\d{3})\D*(\d{4})/;
        if(text) {
            search_doc["$text"] = {"$search": text};
            if(qs != "") {
                qs += "&";
            }
            qs += "text=" + text;
        }
        if(phone) {
            search_doc["contact.phones"] = phone.replace(phone_re, "$1-$2-$3");
            if(qs != "") {
                qs += "&";
            }
            qs += "phone=" + phone;
        }
        if(email) {
            search_doc["contact.emails"] = email;
            if(qs != "") {
                qs += "&";
            }
            qs += "email=" + email;
        }
        if(area) {
            search_doc["siteInfo.area"] = area;
            if(qs != "") {
                qs += "&";
            }
            qs += "area=" + area;
        }

        cb(null, qs, search.find(search_doc));
    }
}

module.exports.SearchDAO = SearchDAO
