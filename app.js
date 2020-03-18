const templateFile = `
update = function()

end

main = function()
    CheckState(Always(), update)
end
`

//initing the editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/ambiance");
editor.session.setMode("ace/mode/lua");
editor.setOptions({
    fontFamily: "monospace",
    fontSize: "10pt"
});


//editor.insert(editor.getValue());

var buffers = new Array();
var actualBuffer = 0;

//tests

addBuffer("foo", "/actors/foo.lua", "a");
addBuffer("bar", "/actors/bar.lua", "b");
addBuffer("baz", "/actors/baz.lua", "c");

//editor.resize();

var socket = io('http://localhost:3000/');
socket.emit('save', {
    "path" : "/tmp/batatinha.json",
    "data" : "batatinha batatosa fagundes"
});

socket.emit('load', "/tmp/batatinha.json");

socket.on('load_res', (data) => {
    alert("i receive "+data);
});

//end tests

function addBuffer(_name, _out, _content) {
    var button = document.createElement("BUTTON");
    button.setAttribute("onclick", "onTabClick("+buffers.length+")");
    button.innerHTML = _name;
    buffers[buffers.length] = {"name" : _name, "tab" : button, "out" : _out,
                               "content" : _content, "active" : true};

    document.getElementById("editor-tabs").innerHTML += button.outerHTML;
}

function onTabClick(id) {
    buffers[actualBuffer].content = editor.getValue();

    buffers[actualBuffer].tab.setAttribute("id", "tab-inactive");
    buffers[id].tab.setAttribute("id", "tab-active");
    var tabs = document.getElementById("editor-tabs");
    tabs.innerHTML = "";
    var len = buffers.length;
    for (var i = 0; i < len; i++) {
        if (buffers[i].active) {
            tabs.innerHTML += buffers[i].tab.outerHTML;
        }
    }

    editor.setValue(buffers[id].content, -1);
    actualBuffer = id;
}

/*
function getvalue() {
    return editor.getValue();
}

function copyselection() {
    return editor.getCopyText();
}

function pastevalue(aValue) {
    editor.insert(aValue);
}*/