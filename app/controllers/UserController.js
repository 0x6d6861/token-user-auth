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

                user.checkPassword(plainPassword).then(function(data){
                    // console.log(data);
                    if(data === true){
                        const payload = {
                            admin: user.email	
                        };
                        const token = jwt.sign(payload, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
        
                        res.json({
                            success: true,
                            message: 'Login Successful',
                            token: token,
                            user: user
                        });
                    }else{
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                })
          
            }
    
        });
    }

    function create(req, res){
        var user = new User({ 
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            username: req.body.username,
            // admin: false 
        });
        user.save(function(err) {
            if (err) throw err;
    
            console.log('User saved successfully');
            res.json({ success: true, user: user });
        });
    
        console.log(user.speak());
    }

    function edit(req, res){
        // Get Logged from jwt, can use Auth middleware here
    }

    function destroy(req, res){
        // Get Logged from jwt, can use Auth middleware here
    }

    return {
        index: index,
        create: create,
        edit: edit,
        destroy: destroy,
        authenticate: authenticate
    };
})();