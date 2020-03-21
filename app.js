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

var pages = Array();
var actors = new Array();
let actualEditingActor = 0;
let actualPage = 0;

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

pages[1] = `
<div id="lateral-bar">
    <button onclick="onLateralTabClick(0)">Actors</button>
    <button onclick="onLateralTabClick(1)">Project</button>
</div>
<div class="form" id="media">
    <div class="item-field-major">
        <span>Sprites</span> <button>+</button> <button>V</button>
    </div>
    <div id="sprites"></div>
    <div class="item-field-major">
        <span>Songs</span> <button>+</button> <button>V</button>
    </div>
    <div id="songs"></div>
    <div class="item-field-major">
        <span>Input</span> <button>+</button> <button>V</button>
    </div>
    <div id="inputs"></div>
</div>
`

function newActorHTML(actor, n) {
    let tab = document.createElement("BUTTON");
    tab.setAttribute("onclick", "onEditorTabClick("+n+")");
    tab.innerHTML = actor.name;

    let button = document.createElement("div");
    button.setAttribute("class", "item-field");
    button.innerHTML = '<span>'+actor.name+'</span><button onclick="editActor('+n+
    ')">Edit</button> <button onclick="eraseActor('+n+')">Erase</button>';

    return { "tab" : tab.outerHTML, "button" : button.outerHTML };
}

function addActor(name, content) {
    let tab = document.createElement("BUTTON");
    tab.setAttribute("onclick", "onEditorTabClick("+actors.length+")");
    tab.innerHTML = name;
    let button = document.createElement("div");
    button.setAttribute("class", "item-field");
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

//giving logic interface error
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
    for (let i = 0; i < len; i++) {
        if (actors[i].editing) {
            actualEditingActor = i;
            break;
        }
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


let sprites = new Array();

function newSpriteHTML(sprite) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<spam>"+sprite.alias+"</spam>";
    return doc.outerHTML;
}

function expandSprites() {
    let sprite_area = document.getElementById("sprites");
    sprite_area.innerHTML = "";
    let len = sprites.length;
    for (let i = 0; i < len; i++) {
        sprite_area.innerHTML += newInputHTML(sprites[i]);
    }
}

function addSprite() {
    sprites[sprites.length] = {
        "alias" : "to edit",
        "path"  : "/tmp/",
    };
}


let songs = new Array();

function newSongHTML(song) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<spam>"+song.alias+"</spam>";
    return doc.outerHTML;
}

function expandSongs() {
    let song_area = document.getElementById("songs");
    song_area.innerHTML = "";
    let len = songs.length;
    for (let i = 0; i < len; i++) {
        song_area.innerHTML += newInputHTML(songs[i]);
    }
}

function addSong() {
    songs[songs.length] = {
        "alias" : "to edit",
        "path"  : "/tmp/",
    };
}


let inputs = new Array();

function newInputHTML(input) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<spam>"+input.alias+"</spam>";
    return doc.outerHTML;
}

function expandInputs() {
    let input_area = document.getElementById("inputs");
    input_area.innerHTML = "";
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
        input_area.innerHTML += newInputHTML(inputs[i]);
    }
}

function addInput() {
    inputs[inputs.length] = {
        "alias"  : "to edit",
        "value" : "0",
    };
}