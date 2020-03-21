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

addActor("foo");
addActor("bar");
addActor("baz");
addActor("batatinha");


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

    if (!actor.editing) {
        tab.setAttribute("id", "tab-inactive");
    } else {
        tab.setAttribute("id", "tab-active");
    }

    return { "tab" : tab.outerHTML, "button" : button.outerHTML };
}

function addActor(name) {
    actors[actors.length] = {
        "name"    : name,
        "content" : "-- actor: "+name+"\n"+templateFile,
        "editing" : false,
    };
    let tmp = newActorHTML(actors[actors.length - 1], actors.length - 1);
    document.getElementById("editor-tabs").innerHTML += tmp.tab;
    document.getElementById("actors").innerHTML += tmp.button;
}

function editActor(id) {
    actors[actualEditingActor].editing = false;
    actors[id].editing = true;
    onEditorTabClick(id);
}

//giving logic interface error
function eraseActor(id) {
    actors.splice(id, 1);
    let len = actors.length;
    let deleteEditing = true;
    for (let i = 0; i < len; i++) {
        if (actors[i].editing) {
            actualEditingActor = i;
            deleteEditing = false;
            break;
        }
    }
    if (deleteEditing && actors.length > 0) {
        actualEditingActor = 0;
        actors[0].editing = true;
        editor.setValue(actors[0].content, -1);
    }
    let tabs = document.getElementById("editor-tabs");
    let actorsList = document.getElementById("actors");
    tabs.innerHTML = "";
    actorsList.innerHTML = "";
    for (let i = 0; i < len; i++) {
        let tmp = newActorHTML(actors[i], i);
        tabs.innerHTML += tmp.tab;
        actorsList.innerHTML += tmp.button;
    }
}

function onEditorTabClick(id) {
    actors[actualEditingActor].content = editor.getValue();

    actors[actualEditingActor].editing = false;
    actors[id].editing = true;
    let tabs = document.getElementById("editor-tabs");
    tabs.innerHTML = "";
    let len = actors.length;
    for (let i = 0; i < len; i++) {
        tabs.innerHTML += newActorHTML(actors[i], i).tab;
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