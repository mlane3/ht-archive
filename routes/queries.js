function QueryHandler(client) {
    "use strict";

    this.getAllEntities = function(req, res, next) {
        "use strict";
        client.query("SELECT * FROM backpageentities;", function(err, result) {
            if(err) {
                console.error("error running query", err);
                return res.status(500).json({
                    "message": err
                });
            }
            return res.status(200).json({
                "status": "success",
                data: result.rows
            });
        });
    }

    var entity_q = "SELECT backpageentities.entity_id::integer,backpageemail.name,backpagephone.number FROM backpageentities";
    entity_q += " LEFT JOIN backpageemail ON backpageentities.backpagepostid::integer = backpageemail.backpagepostid";
    entity_q += " LEFT JOIN backpagephone ON backpageentities.backpagepostid::integer = backpagephone.backpagepostid";
    entity_q += " WHERE backpageentities.entity_id = $1;"
    this.getEntityById = function(req, res, next) {
        "use strict";
        client.query(entity_q, req.params["id"], function(err, result) {
            if(err) {
                console.error("error running query", err);
                return res.status(500).json({
                    "message": err
                });
            }

            var data = {
                "entity_id": req.params["id"],
                "phones": [],
                "emails": []
            };

            result.rows.map(function(row) {
                if(row["name"] && data["emails"].indexOf(row["name"]) == -1) {
                    data["emails"].push(row["name"]);
                }
                if(row["number"] && data["phones"].indexOf(row["number"]) == -1) {
                    data["phones"].push(row["number"]);
                }
            });

            return res.status(200).json({
                data
            });
        });
    }

    var search_q = "SELECT backpageentities.entity_id::integer AS id, ARRAY_TO_STRING(ARRAY_AGG(DISTINCT backpagephone.number), ', ') as phone, ARRAY_TO_STRING(ARRAY_AGG(DISTINCT backpageemail.name), ', ') as email, COUNT(DISTINCT backpageentities.backpagepostid) postCount FROM backpageentities";
    search_q += " LEFT JOIN backpageemail ON backpageentities.backpagepostid::integer = backpageemail.backpagepostid";
    search_q += " LEFT JOIN backpagephone ON backpageentities.backpagepostid::integer = backpagephone.backpagepostid";
    search_q += " WHERE ";
    this.searchEntities = function(req, res, next) {
        "use strict";
        var emails = [];
        var phones = [];
        var q = search_q;
        if(req.query["email"] && req.query["email"].constructor === Array) {
            emails = req.query["emais"];
        } else if(req.query["email"]) {;
            emails.push(req.query["email"])
        }
        if(req.query["phone"] && req.query["phone"].constructor === Array) {
            phones = req.query["phone"];
        } else if(req.query["phone"]) {
            phones.push(req.query["phone"]);
        }
        console.log(phones);
        console.log("match: " + (phones[0] == '678-680-9278'));
        q += 'backpageemail.name = ANY(\'{"' + emails.join('","') + '"}\'::text[]) OR backpagephone.number = ANY(\'{"' + phones.join('","') + '"}\'::text[])'
        q += " GROUP BY backpageentities.entity_id;"
        client.query(q, function(err, result) {
            console.log(q);
            if(err) {
                console.error("error running query", err);
                return res.status(500).json({
                    "message": err
                });
            }

            var data = { "entities": [] };
            console.log(result.rows);
            result.rows.map(function(row) {
                data["entities"].push(row);
            });

            return res.status(200).json(data);
        });
    }
}


module.exports = QueryHandler;
