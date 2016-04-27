/* 
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */


function DiscoverHandler(client) {
    "use strict";

    this.displaySearch = function(req, res, next) {
        console.log("HEY");
        return res.render("discover");
    }
}

module.exports = DiscoverHandler;
