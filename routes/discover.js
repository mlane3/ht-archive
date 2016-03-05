// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

function DiscoverHandler(client) {
    "use strict";

    this.displaySearch = function(req, res, next) {
        console.log("HEY");
        return res.render("discover");
    }
}

module.exports = DiscoverHandler;
