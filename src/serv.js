/**
 * Testing the server's response to a client
 * side page's response
 */

//Test: Looking for IPv4 of host machine
const os = require('os');

const { randomInt } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

//Parses requests into a json
app.use(express.json());

//Sets port that will be listened to
const port = 6442;

var networkInterfaces = os.networkInterfaces();

//Begins listening on port set. Server is started
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log('Server is listening on port: ' + port);

   

    //Code was borrowed from: https://www.jsdiaries.com/how-to-get-a-local-ip-address-in-node-js/
    //The name of the connection is going to need to change for each machine running it I'm pretty sure, which is what the following line is for
    //console.log('Network interface: ' + JSON.stringify(networkInterfaces));
    const ip = networkInterfaces["Wi-Fi"][1].address;

    // Generates the link that llows other users to access the messaging system
    console.log('Generated link: http://' + ip + ':' + port );
});

// Handles initial get request from client
app.get('/', (req, res) => {

    //console.log('req received GET');

    res.sendFile(path.resolve(__dirname, './pages/test.html'));

    fs.appendFile('./pages/logs.txt', 'A user has connected\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('User connected');
        }
    })
});

// Handles post request made by user for a refresh of chat box
app.post('/ref', (req, res) => {

    fs.readFile('./pages/recent.txt', 'utf8', (err, data) => {
        if (err) console.log(err);
        else {
            var recentLog = data;

            res.write(recentLog);
            res.send();
        }
    });
});
// Handles post request made by user where they send message
app.post('/test', (req, res) => {

    //Prints msg to console
    const _msg = req.body.message;
    const _name = req.body.name;
    //console.log('req received POST: \n' + (_msg));

    //ROLAND

    //Creates entry for the log and writes to log file
    var logEntry = '(' + _name.substring(0, 5) + ')\tPost ID ' + randomInt(100, 999) + ': ' + _msg;
    fs.appendFile('./pages/logs.txt', logEntry + '\n', (err) => {
        if (err) console.log(err);
        else {
            console.log('Message logged');
        }
    });

    fs.readFile('./pages/recent.txt', 'utf8', (err, data) => {
        if (err) console.log(err);
        else {

            //console.log('Appending data: ' + logEntry + ',\nAppended data\n' + data);

            logEntry = '<br>' + logEntry + '<br>\n';
            logEntry += data;

            fs.writeFile('./pages/recent.txt', logEntry, (err) => {
                if (err) console.log(err);
            });

            //TODO change this so that the data from a file is written to
            //the response. and implement recent/log files
            res.write(logEntry);
            res.send();

            //console.log('response sent: ' + logEntry);
        }
    });

});

// Handles all other get requests
app.all('*', (req, res) => {
    res.status(404).send('Not found...')
});
