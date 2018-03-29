'use strict';
const mongoose    = require('mongoose');
const config = require('../config');
module.exports = (function () {
    mongoose.connect(config.database).then(function () {
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            // we're connected!
            return db;
        });
    });
})();