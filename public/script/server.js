const nodemailer = require('nodemailer');
const morgan = require('morgan');
const express = require('express');
const multer = require('multer'); // handles multipart/form-data text inputs
const upload = multer();
const path = require('path');
const app = express();

require('dotenv').config({ path: '../../.env' });

app.listen(5000);

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../../public')));

app.get('*', (req, res) => {
    res.redirect('/');
});

// Mail
app.post('/send-contact-form', upload.none(), (req, res) => {
    const reqObj = Object.assign({}, req.body);
    console.log(reqObj);

    // Simple Mail Transfer Protocol is an application that is used to send, 
    // receive, and relay outgoing emails between senders and receivers. 
    // When an email is sent, it's transferred over the internet 
    // from one server to another using SMTP.

    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        auth: {
            user: process.env.TRANSPORTER_USER,
            pass: process.env.TRANSPORTER_PASS
        },

        tls: {
            rejectUnauthorized: false
        }
    });

    let receiver = {
        from: process.env.TRANSPORTER_USER,
        to: null,
        subject: `${reqObj.subject}`,
        html: `<h4>Message from <strong>${reqObj.name}</strong> < ${reqObj.email} ></h4>
        <p>${reqObj.message}</p>`
    };

    transporter.sendMail(receiver, (err, info) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false });
            return;
        } else {
            console.log(`Sent: ${info.response}`);
            res.status(200).json({ success: true });
        };
    });
});
