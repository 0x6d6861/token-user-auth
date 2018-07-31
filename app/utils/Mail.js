'use strict';
const nodemailer = require('nodemailer');
const config = require('../../config');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing



    // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport(config.smtpConfig,
       {
           from: '"Cool App 👻" <heri@heri.co>',
       }
   );

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <heri@heri.co>', // sender address
        to: 'agapelas@gmail.com, agape@live.fr', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    }; 

    // send mail with defined transport object
   transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }); 

module.exports = transporter;