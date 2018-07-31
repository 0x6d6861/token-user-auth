'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } =  require('validator');
const config = require('../../config'); // get our config file

// set up a mongoose model
const UserSchema = new Schema({
    name: String,
    username: { 
        type: String, 
        lowercase: true,
        index: { unique: true, dropDups: true } 
    },
    password: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        index: { unique: true, dropDups: true },
        required: 'Email address is required',
        validate: [isEmail, 'Please fill a valid email address'],
    },
    admin: { 
        type: Boolean,
        default: false
    }
});

UserSchema.methods.speak = function () {
	return `${this.name} says hello!`;
};


UserSchema.pre('save', function (next) {
    const _self = this;
    bcrypt.hash(this.password, config.saltRounds).then(function(hash) {
        _self.password = hash;
        next();
    });
});

UserSchema.pre('update', function (next) {
    const _self = this;
    if (this.isModified("password")) {
        bcrypt.hash(this.password, config.saltRounds).then(function(hash) {
            _self.password = hash;
            next();
        });
      }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password)
};

UserSchema.set('toJSON', {
    getters: true,
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});


module.exports = mongoose.model('User', UserSchema);