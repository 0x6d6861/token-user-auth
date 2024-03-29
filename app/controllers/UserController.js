'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../../config');
var validator = require('validator');


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

        if(email && !validator.isEmail(email)){
            return res.status(401).send({
                success: false,
                message: "Invalid email format"
            });
        }

        User.findOne({
            $or: [{username : username}, { email: email}]
        }, function(err, user) {

            if (err) throw err;
    
            if (!user) {
                return res.json({ success: false, message: 'Authentication failed. User not found.' });
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
        
                        return res.json({
                            success: true,
                            message: 'Login Successful',
                            token: token,
                            user: user
                        });
                    }else{
                        return res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                })
          
            }
    
        });
    }

    function create(req, res){

        let name = req.body.name;
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        if(email && !validator.isEmail(email)){
            return res.status(401).send({
                success: false,
                message: "Invalid email format"
            });
        }

        User.findOne({
            $or: [{username : username}, { email: email}]
        }, function(err, user) {

            if (err) throw err;
    
            if (user) {
                return res.json({ success: false, message: 'User with the provided details already exists' });
            }

            var newUser = new User({ 
                name: name,
                password: password,
                email: email,
                username: username,
                // admin: false 
            });
    
            newUser.save(function(err) {
                if (err) throw err;
                return res.json({ success: true, user: newUser });
            });
        

        });

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