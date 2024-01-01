const express = require("express")
require('dotenv').config();
const cron = require('node-cron');
const port = process.env.PORT
const fs = require('fs');
const app = express()


app.use(express.json());

//good idea to make it into an Auth-ed dashboard to live-track my websites

//email config === TO BE REWORKED
const resend = new Resend(process.env.EMAIL_API_KEY);

//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/sites/1/track', (req, res) => {
    const data = req.body;
    console.log('Tracking data from 1 received:', data);
  
    // append data to a file
    fs.appendFileSync('trackingData1.json', JSON.stringify(data) + '\n');
  
    res.sendStatus(200);
});
app.post('/sites/2/track', (req, res) => {
    const data = req.body;
    console.log('Tracking data from 2 received:', data);
  
    // append data to a file
    fs.appendFileSync('trackingData2.json', JSON.stringify(data) + '\n');
  
    res.sendStatus(200);
});


// Schedule cron-job to run every week
cron.schedule('0 0 * * 0', () => {
    // HERE GOES THE EMAIL CONFIG TO BE SENT
  }, {
    scheduled: true,
    timezone: "Europe/Austria"
});

app.listen(port, () => {
    console.log(`Tracker app listening on port ${port}`)
})
