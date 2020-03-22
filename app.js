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
    <div id="sprites-field" class="item-field-major">
        <span>Sprites</span> <button onclick="addSprite()">+</button> <button id="expand-button" onclick="expandSprites()">V</button>
    </div>
    <div id="sprites"></div>
    <div id="songs-field" class="item-field-major">
        <span>Songs</span> <button onclick="addSong()">+</button> <button id="expand-button" onclick="expandSongs()">V</button>
    </div>
    <div id="songs"></div>
    <div id="inputs-field" class="item-field-major">
        <span>Input</span> <button onclick="addInput()">+</button> <button id="expand-button" onclick="expandInputs()">V</button>
    </div>
    <div id="inputs"></div>
</div>
<div class="edit-form second-form" id="edit-media">
    <div id="edit-media-form" style="display: flex; flex-direction: column;">
        <label>Alias:</label>
        <input id="alias-field" type="text"></text>
    </div>
    <div id="edit-media-submit" style="display: flex; flex-direction: row;">
    </div>
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

function newSpriteHTML(sprite, n) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<span>Alias: "+sprite.alias+" Path: "+sprite.path+"</span> <button onclick='editSprite("+n+")'>Edit</button> <button onclick='eraseSprite("+n+")'>X</button>";
    return doc.outerHTML;
}

function expandSprites() {
    let sprite_area = document.getElementById("sprites");
    sprite_area.innerHTML = "";
    let len = sprites.length;
    for (let i = 0; i < len; i++) {
        sprite_area.innerHTML += newSpriteHTML(sprites[i], i);
    }
    document.getElementById("sprites-field").innerHTML =
    '<span>Sprites</span> <button onclick="addSprite()">+</button> <button id="hide-button" onclick="hideSprites()">^</button>';
}

function eraseSprite(n) {
    sprites.splice(n, 1);
    expandSprites();
}

function addSprite() {
    sprites[sprites.length] = {
        "alias"   : "to edit",
        "path"    : "/tmp/",
        "editing" : false,
    };
    expandSprites();
}

function hideSprites() {
    document.getElementById("sprites").innerHTML = "";
    document.getElementById("sprites-field").innerHTML =
    '<span>Sprites</span> <button onclick="addSprite()">+</button> <button id="expand-button" onclick="expandSprites()">V</button>';
}

function editSprite(n) {
    let len = sprites.length;
    for (let i = 0; i < len; i++) {
        if (sprites[i].editing) {
            sprites[i].editing = false;
        }
    }
    sprites[n].editing = true;
    document.getElementById("edit-media").innerHTML = `
    <div id="edit-media-form" style="display: flex; flex-direction: column;">
        <label>Alias:</label> <input id="alias-field" type="text">
        <label>Path:</label>  <input id="path-field" type="text">
    </div>
    <div id="edit-media-submit" style="display: flex; flex-direction: row;">
        <button onclick="saveSprite()">Save</button> <button onclick="cancelSprite()">Cancel</button>
    </div>`;
    document.getElementById("alias-field").value = sprites[n].alias;
    document.getElementById("path-field").value = sprites[n].path;
}

    function saveSprite() {
        let len = sprites.length;
        for (let i = 0; i < len; i++) {
            if (sprites[i].editing) {
                sprites[i].alias = document.getElementById("alias-field").value;
                sprites[i].path  = document.getElementById("path-field").value;
                expandSprites();
            }
        }
    }

    function cancelSprite() {
        let len = sprites.length;
        for (let i = 0; i < len; i++) {
            if (sprites[i].editing) {
                sprites.editing = false;
            }
        }
        document.getElementById("edit-media").innerHTML = "";
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
    document.getElementById("songs-field").innerHTML =
    '<span>Songs</span> <button onclick="addSong()">+</button> <button id="hide-button" onclick="hideSongs()">^</button>';
}

function addSong() {
    songs[songs.length] = {
        "alias" : "to edit",
        "path"  : "/tmp/",
    };
    expandSongs();
}

function hideSongs() {
    document.getElementById("songs").innerHTML = "";
    document.getElementById("songs-field").innerHTML =
    '<span>Songs</span> <button onclick="addSong()">+</button> <button id="expand-button" onclick="expandSongs()">V</button>';
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
    document.getElementById("inputs-field").innerHTML =
    '<span>Input</span> <button onclick="addInput()">+</button> <button id="hide-button" onclick="hideInputs()">^</button>';
}

function addInput() {
    inputs[inputs.length] = {
        "alias"  : "to edit",
        "value" : "0",
    };
    expandInputs();
}

function hideInputs() {
    document.getElementById("inputs").innerHTML = "";
    document.getElementById("inputs-field").innerHTML =
    '<span>Input</span> <button onclick="addInput()">+</button> <button id="expand-button" onclick="expandInputs()">V</button>';
}
