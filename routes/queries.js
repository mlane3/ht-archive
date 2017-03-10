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
    
    var detail_q = "SELECT backpageentities.entity_id::integer AS id, ";
    detail_q += "ARRAY_TO_STRING(ARRAY_AGG(DISTINCT backpagephone.number), ', ') as phone, ";
    detail_q += "ARRAY_TO_STRING(ARRAY_AGG(DISTINCT backpageemail.name), ', ') as email, ";
    detail_q += "COUNT(DISTINCT backpageemail.backpagepostid) postCount ";
    detail_q += "FROM backpageentities ";
    detail_q += "LEFT JOIN backpageemail ON backpageentities.backpagepostid::integer = backpageemail.backpagepostid::integer ";
    detail_q += "LEFT JOIN backpagephone ON backpageentities.backpagepostid::integer = backpagephone.backpagepostid::integer ";

    var search_q = "SELECT DISTINCT backpageentities.entity_id::integer AS id FROM backpageentities"
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
        q += 'backpageemail.name = ANY(\'{"' + emails.join('","') + '"}\'::text[]) OR backpagephone.number = ANY(\'{"' + phones.join('","') + '"}\'::text[])'

        client.query(q, function(err, result) {
            if(err) {
                console.error("error running query", err);
                return res.status(500).json({
                    "message": err
                });
            }

            var data = { "entities": [] };

            result.rows.map(function(row) {
              var tmp = detail_q;
              tmp += "WHERE backpageentities.entity_id = " + row.id;
              tmp += "GROUP BY backpageentities.entity_id;"

              client.query(tmp, function(err, details) {
                if(err) {
                    console.error("error running query", err);
                    return res.status(500).json({
                        "message": err
                    });
                }

                data["entities"].push(details);

                return res.status(200).json(data);
              });
            });

        });
    }
}


module.exports = QueryHandler;
