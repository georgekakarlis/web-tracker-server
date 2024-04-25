const express = require("express")
require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors')
const port = process.env.PORT
const fs = require('fs');

const app = express()

app.use(cors());
app.use(express.json());

//good idea to make it into an Auth-ed dashboard to live-track my websites


// Function to append data to a JSON file
const trackData = (siteId, data) => {
    const filePath = `site${siteId}.json`;
    let currentData = [];
    if (fs.existsSync(filePath)) {
        currentData = JSON.parse(fs.readFileSync(filePath));
    }
    currentData.push(data);
    fs.writeFileSync(filePath, JSON.stringify(currentData));
};

// Endpoint for site 1
app.post('/sites/1/trackitbaby/yes/you', (req, res) => {
    trackData(1, req.body);
    res.send('Data tracked for site 1');
});

// Endpoint for site 2
app.post('/sites/2/trackitbaby/yes/you', (req, res) => {
    trackData(2, req.body);
    res.send('Data tracked for site 2');
});

let config = {
    service: 'gmail', 
    auth: {
        user: process.env.NODEJS_GMAIL_APP_USER,   
        pass: process.env.NODEJS_GMAIL_APP_PASSWORD 
    }
}

// Email Configuration
const transporter = nodemailer.createTransport(config);

// Function to send email
const sendEmail = (siteId) => {
    const filePath = `site${siteId}.json`;

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVER_EMAIL,
        subject: `Weekly Report for Site ${siteId}`,
        text: `Attached is the weekly report for Site ${siteId}.`,
        attachments: [{ path: filePath }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            // Delete the file after sending the email
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}:`, err);
                } else {
                    console.log(`Successfully deleted ${filePath}`);
                }
            });
        }
    });
};



// Schedule cron-job to run every week
cron.schedule('0 0 * * 0', () => {
   sendEmail(1);
   sendEmail(2);
  });

app.listen(port, () => {
    console.log(`Tracker app listening on port ${port}`)
})
