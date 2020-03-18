const port    = 3000;
const path    = require('path');
const express = require('express');

var app    = require('express')();
var server = require('http').Server(app);
var io     = require('socket.io')(server);
var fs     = require('fs');

server.listen(port);

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("[log] Listening at "+port);
    socket.on('save', (data) => {
        console.log("[log] Receiving "+data+" and saving at "+data.path);
        fs.writeFile(data.path, JSON.stringify(data.data), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("[log] File was saved");
        });
    });
    socket.on('load', (path) => {
        console.log("[log] Loading data at "+path);
        fs.readFile(path, (err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log("[log] File was loaded");
            socket.emit('load_res', JSON.parse(data));
        });
    });
});

function exportProject(path, buffers) {
    var len = buffers.length;
    for (var i = 0; i < len; i++) {
        fs.writeFile(path+buffers[i].out, buffers[i].content, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("[log] file was saved");
        });
    }
}