/**
 * Testing the server's response to a client
 * side page's response
 */

//Modules used in the project
const { randomInt } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

//Parses requests into a json
app.use(express.json());

//Sets port that will be listened to
const port = 3000;

//Begins listening on port set. Server is started
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log('Server is listening on port: ' + port);
});

// Handles initial get request from client
app.get('/', (req, res) => {

    console.log('req received GET');

    res.sendFile(path.resolve(__dirname, './pages/test.html'));
});

// Handles post request made by user
app.post('/test', (req, res) => {

    //Prints msg to console
    const msg = req.body.message;
    console.log('req received POST: \n' + (msg));

    const writeStream = fs.createWriteStream('./pages/logs.txt');
    const readStream = fs.createReadStream('./pages/logs.txt');

    //TODO change this so that the data from a file is written to
    //the response. and implement recent/log files
    res.write('Post ID ' + randomInt(100, 999) + ': ' + msg);

    readStream.pipe(res);
    res.send();

    readStream.close();
});

// Handles all other get requests
app.all('*', (req, res) => {
    res.status(404).send('Not found...')
});
