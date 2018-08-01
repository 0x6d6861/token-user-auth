'use strict';
const nodemailer = require('nodemailer');
const config = require('../../config');
var ejs = require('ejs');
var path = require('path');

   let transporter = nodemailer.createTransport(config.smtpConfig,
       {
           from: '"Heri Agape" <heri@heri.co>',
       }
   );

      


    var sendRegistrationEmail = function (email, name) {
        // transporter.template
        
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: email, 
            subject: 'Account Creation - Login Service', 
            text: `Welcome ${name} to our awsome serice`
        };

        ejs.renderFile(path.join(__dirname, './views/Email/registration.ejs'), { name: name }, function(err, str){
            mailOptions.html = str;
            // if(err){
            //     throw err;
            // }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw error;
                }
                console.log('Message sent: %s', info.messageId);
            });

        });
        
    };


module.exports = {
    sendRegistrationEmail: sendRegistrationEmail
};