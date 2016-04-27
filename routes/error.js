/* 
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


// Err handling middleware
// TODO: This is great for debuging, but needs to be changed in the future
exports.errorHandler = function(err, req, res, next) {
    "use strict";
    console.error(err["message"]);
    console.error(err["stack"]);
    res.status(500);
    res.render("Oops", {err: err});
}
