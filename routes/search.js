// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

var daos    = require("./daos"),
    cheerio = require("cheerio");

function SearchHandler(client) {
    "use strict";

    var searchdao = new daos.SearchDAO(client);

    this.displaySearch = function(req, res, next) {
        "use strict";

        if(!req.usr) return res.redirect("/login");

        searchdao.getAreas(function(err, areas) {
            return res.render("index", {
                search_type: "text",
                text: "",
                areas: areas,
                phone: "",
                email: "",
                usr: req.usr
            });
        });
    }

    this.handleQuery = function(req, res, next) {
        "use strict";

        if(!req.usr) return res.redirect("/login");

        var usr = req.usr;
        var errs  = "";
        console.log(req.body);
        var text  = req.body.search_text;
        var area  = req.body.search_area;
        var phone = req.body.phone;
        var email = req.body.email;
        var page = 0;
        var date_re = /^\d{2}-\d{2}-\d{4}$/;
        var startdate = null;
        var enddate = null;
        if(date_re.test(req.body.startdate)) {
            startdate = req.body.startdate;
        }
        if(date_re.test(req.body.enddate)) {
            startdate = req.body.enddate;
        }

        searchdao.getBackpageQuery(text, phone, email, area, page, function(err, qs, cur) {
            if(err) {
                req.errs = "Error: database error";
                return res.render("index");
            }
            if(!cur.length) {
                req.errs = "Error: no search results";
                return res.render("index");
            }

            searchdao.getAreas(function(err, areas) {
                var doc =  {"docs": cur, "page": page, "first_doc": 0,
                    "count": cur[0]["total"], "qs": qs, "usr": usr,
                    "text": text, "area": area, "phone": phone, "prev": 0,
                    "email": email, "areas": areas };
                if(cur.length >= 20) {
                    doc["next"] = 1;
                }
                res.render("search", doc);
            });
        });
    }

    function getNext(doc, cb, fin) {
        var curr = doc["page"];
        var count = doc["count"];

        if((curr * 20) <= count) {
            doc["next"] = curr + 1;
            return cb(doc, fin);
        } else {
            return cb(doc, fin);
        }
    }

    function getPrev(doc, cb) {
        var curr = doc["page"];

        if(curr > 0) {
            doc["prev"] = curr - 1;
            return cb(doc);
        } else {
            return cb(doc);
        }
    }

    function processCursor(cur, doc, cb) {
        cur.skip(doc["first_doc"]);
        cur.limit(20).toArray(function(err, docs) {
            doc["docs"] = docs;
            getNext(doc, getPrev, cb);
        });
    }

    this.displayQuery = function(req, res, next) {
        "use strict";

        if(!req.usr) return res.redirect("/login");

        var text = req.query["text"];
        var phone = req.query["phone"];
        var email = req.query["email"];
        var area = req.query["area"]
        var pagenum = req.query["page"];
        console.log(req.query);
        var first_doc = 0;
        var num_re = /^[0-9]+$/;
        console.log("displayQuery page: " + pagenum);
        if(pagenum >= 0) {
            if(num_re.test(pagenum)) {
                pagenum = parseInt(pagenum);
                first_doc = pagenum * 20;
            } else {
                return next(Error("page number must be an integer"));
            }
        } else {
            pagenum = 0;
        }
        console.log("displayQuery: " + pagenum);
        searchdao.getBackpageQuery(text, phone, email, area, pagenum, function(err, qs, cur) {
            if (err) next(err);

            var usr = req.usr;
            var page = pagenum + 1;
            var total = cur[0]["total"];
            var doc = { "page": pagenum, "qs": qs, "first_doc": first_doc,
                "usr": usr, "text": text, "email": email, "phone": phone,
                "area": area, "docs": cur, "count": total,
                "prev": pagenum - 1
            };
            if(total >= 20) {
                doc["next"] = page;
            }
            searchdao.getAreas(function(err, areas) {
                doc["areas"] = areas
                return res.render("search", doc);
            });
        });
    }

    this.parseShow = function(req, res, next) {
        "use strict";
        if(!req.usr) return res.redirect("/login");
        if(req.query && req.query["id"]) {
            searchdao.getBackpagePost(req.query["id"], function(err, doc) {
                if(err) return next(err);

                if(!doc) {
                    return res.render("Oops", {"error": "No document found"});
                }
                req.doc = doc;
                next();
            });
        } else {
            res.render("Oops", {"error": "Document could not be found"});
        }
    }

    this.displayShow = function(req, res, next) {
        "use strict";
        if(!req.usr) return res.redirect("/login");
        if(req.doc && req.doc["content"]) {
            req.doc["content"] = cheerio.load(req.doc["content"])("div.mainBody").html();
            return res.render("show", req.doc);
        } else {
            return res.render("Oops", {"error": "Document could not be found"});
        }
    }

    this.handleShow = function(req, res, next) {
        "use strict";
        if(!req.usr) return res.redirect("/login");

        var id = req.body.id;
        searchdao.getBackpagePost(id, function(err, doc) {
            if(err) return next(err);

            if(!doc) {
                return res.render("Oops", {"error": "No document found"});
            }
            req.doc = doc;
            next();
        });
    }
}

module.exports = SearchHandler;
