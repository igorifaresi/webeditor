const port    = 3000;
const path    = require('path');
const express = require('express');

const electron = require('electron'),
    electronApp = electron.app,
    BrowserWindow = electron.BrowserWindow;

var showdown  = require('showdown');
var markdownConverter = new showdown.Converter();
var app      = require('express')();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var fs       = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

server.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, '/www/')));

if (process.env.APP_MODE == 'electron-app') {
    electronApp.on('ready', () => {
        express();
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            useContentSize: true,
            resizable: true,
        });
        mainWindow.loadURL(process.env.URL);
        mainWindow.focus();
    });
} else {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/www/index.html');
    });
}

io.on('connection', (socket) => {
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
    socket.on('store-media', (media) => {
        var matches = media.data.match(/^data:.+\/(.+);base64,(.*)$/);
        var buffer  = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(__dirname+"/game/assets/"+media.fileName, buffer);
    });
    socket.on('run', () => {
        exec('cd game; ./game', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
        });
    });
    socket.on('store-actor', (actorScript) => {
        fs.writeFileSync(__dirname+"/game/actors/"+actorScript.fileName, actorScript.script);
    });
});