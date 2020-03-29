const port    = 3000;
const path    = require('path');
const express = require('express');

var showdown  = require('showdown');
var markdownConverter = new showdown.Converter();
var app      = require('express')();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var fs       = require('fs');
const { exec } = require('child_process');

server.listen(port);

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("[log] Listening at "+port);
    socket.on('save', (data) => {
        console.log("[log] Creating "+data.dir+" directory");
        exec('mkdir ' + data.dir, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            } else {
                console.log("[log] Directory was created");
            }
            console.log("[log] Receiving "+data+" and saving at "+data.dir+"/"+data.fileName);
            fs.writeFile(data.dir+"/"+data.fileName, JSON.stringify(data.data), (err) => {
                if (err) {
                    return console.log(err);
                }
                console.log("[log] File was saved");
            });
        });
    });
    //socket.on('load', (path) => {
    //    console.log("[log] Loading data at "+path);
    //    fs.readFile(path, (err, data) => {
    //        if (err) {
    //            return console.log(err);
    //        }
    //        console.log("[log] File was loaded");
    //        socket.emit('load_res', JSON.parse(data));
    //    });
    //});
    socket.on('export', (data) => {
        console.log("[log] Creating "+data.dir+" directory");
        exec('mkdir ' + data.dir, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            } else {
                console.log("[log] Directory was created");
            }
            console.log("[log] Receiving "+data+" and saving at "+data.dir+"/"+data.fileName);
            fs.writeFile(data.dir+"/"+data.fileName, data.data, (err) => {
                if (err) {
                    return console.log(err);
                }
                console.log("[log] File was saved");
            });
        });
    });
    socket.on('get-markdown', (data) => {
        console.log("[log] Asking for "+__dirname+"/doc/"+data+" markdown html");
        fs.readFile(__dirname+"/doc/"+data, (err, file) => {
            if (err) {
                return console.log(err);
            }
            console.log("[log] File was loaded 'get-markdown'");
            socket.emit('get-markdown-resp', markdownConverter.makeHtml(file.toString()));
        });
    });
});