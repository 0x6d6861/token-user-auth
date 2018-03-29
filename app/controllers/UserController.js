'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../../config');

module.exports = (function(req, res){
    function index (req, res){
        return User.find({}, function(err, users) {
            res.json(users);
        });
    }
    function authenticate (req, res) {
        let plainPassword = req.body.password;
        let username = req.body.username;
        let email = req.body.email;
        User.findOne({
            $or: [{username : username}, { email: email}]
        }, function(err, user) {

            if (err) throw err;
    
            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
                // check if password matches
                if (user.checkPassword(plainPassword)) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    const payload = {
                        admin: user.admin	
                    };
                    const token = jwt.sign(payload, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
    
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }		
    
            }
    
        });
    }
    return {
        index: index,
        authenticate: authenticate
    };
})();