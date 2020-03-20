const templateFile = `update = function()

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

var actors = new Array();
var actualEditingActor = 0;

//tests

addActor("foo", "a");
addActor("bar", "b");
addActor("baz", "c");
addActor("batatinha", templateFile);


var socket = io('http://localhost:3000/');
socket.emit('save', {
    "path" : "/tmp/batatinha.lzw",
    "data" : "batatinha batatosa fagundes"
});

socket.emit('load', "/tmp/batatinha.lzw");

socket.on('load_res', (data) => {
    alert("i receive "+data);
});

//end tests
var pages = Array();
var actualPage = 0;

pages[1] = `
<div id="lateral-bar">
    <button onclick="onLateralTabClick(0)">Actors</button>
    <button onclick="onLateralTabClick(1)">Project</button>
</div>
`

function addActor(name, content) {
    let tab = document.createElement("BUTTON");
    tab.setAttribute("onclick", "onEditorTabClick("+actors.length+")");
    tab.innerHTML = name;
    let button = document.createElement("div");
    button.setAttribute("id", "actor-field");
    button.innerHTML = '<span>'+name+'</span><button onclick="editActor('+actors.length+
    ')">Edit</button> <button onclick="eraseActor('+actors.length+')">Erase</button>';
    actors[actors.length] = {"name" : name, "tab" : tab, "button" : button,
                             "content" : content, "editing" : true};

    document.getElementById("editor-tabs").innerHTML += tab.outerHTML;
    document.getElementById("actors").innerHTML += button.outerHTML;
}

function editActor(id) {
    actors[id].editing = true;
    onEditorTabClick(id);
    //alert("edit actor: "+id);
}

function eraseActor(id) {
    actors.splice(id, 1);
    let len = actors.length;
    for (let i = 0; i < len; i++) {
        actors[i].tab.setAttribute("onclick", "onEditorTabClick("+i+")");
        actors[i].button.innerHTML = '<span>'+actors[i].name+'</span><button onclick="editActor('+i+
        ')">Edit</button> <button onclick="eraseActor('+i+')">Erase</button>';
    }
    let tabs = document.getElementById("editor-tabs");
    let actorsList = document.getElementById("actors");
    tabs.innerHTML = "";
    actorsList.innerHTML = "";
    for (let i = 0; i < len; i++) {
        tabs.innerHTML += actors[i].tab.outerHTML;
        actorsList.innerHTML += actors[i].button.outerHTML;
    }
}

function onEditorTabClick(id) {
    actors[actualEditingActor].content = editor.getValue();

    actors[actualEditingActor].tab.setAttribute("id", "tab-inactive");
    actors[id].tab.setAttribute("id", "tab-active");
    let tabs = document.getElementById("editor-tabs");
    tabs.innerHTML = "";
    let len = actors.length;
    for (let i = 0; i < len; i++) {
        if (actors[i].editing) {
            tabs.innerHTML += actors[i].tab.outerHTML;
        }
    }

    editor.setValue(actors[id].content, -1);
    actualEditingActor = id;
}

function onLateralTabClick(id) {
    if (actualPage == 0) {
        actors[actualEditingActor].content = editor.getValue();
        editor.destroy();
    }
    pages[actualPage] = document.getElementById("main-area").innerHTML;
    document.getElementById("main-area").innerHTML = pages[id];
    if (id == 0) {
        document.getElementById("editor").innerHTML = "";
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/ambiance");
        editor.session.setMode("ace/mode/lua");
        editor.setOptions({
            fontFamily: "monospace",
            fontSize: "10pt"
        });
        editor.setValue(actors[actualEditingActor].content, -1);
    }
    actualPage = id;
}