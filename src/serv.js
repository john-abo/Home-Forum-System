/**
 * Testing the server's response to a client
 * side page's response
 */

//Testing express js for use in project
const { randomInt } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = 3000;

app.listen(port, ()=>{
    console.log('Server is listening on port: ' + port);
});

// Handles initial get request from client
app.get('/', (req, res) => {

    console.log('req received GET');

    res.sendFile(path.resolve(__dirname,'./pages/test.html'));
});

// Handles post request made by user
app.post('/test', (req, res) => {

    console.log('req received POST: \n' + (req.body));
    
    const writeStream = fs.createWriteStream('./pages/logs.txt');
    const readStream = fs.createReadStream('./pages/logs.txt');

    res.write('Post ID ' + randomInt(10,99));

    readStream.pipe(res);
    res.send();

    readStream.close();
});

// Handles all other get requests
app.all('*', (req,res)=>{
    res.status(404).send('Not found...')
});
