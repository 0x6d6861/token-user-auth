'use strict';
const express 	= require('express');
const Auth        = require('./middleware/Auth'); // Authentication Middleware

const UserController  = require("./controllers/UserController");

 module.exports = (function(req, res){

    const UserRoutes = express.Router();
    // UserRoutes.use(Auth);

    UserRoutes.get('/', Auth, UserController.index);
    UserRoutes.post('/authenticate', UserController.authenticate);

    UserRoutes.get('/get', Auth, function(req, res) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    });

    UserRoutes.get('/check', function(req, res) {
        res.json(req.decoded);
    });

    return {
        User: UserRoutes
    }

 })();