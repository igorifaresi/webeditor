const port = 8000;

const fs      = require('fs');
const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.static(path.join(__dirname, '/')))

app.listen(port, () => {
    console.log('[log] App in http://localhost:'+port+'/');
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