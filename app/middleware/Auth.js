'use strict';
const config = require('../../config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization || req.headers.token;
	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
	}
};