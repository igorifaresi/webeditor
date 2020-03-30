const templateFile = `update = function()

end

main = function()
    CheckState(Always(), update)
end
`

//initing the editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
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
    "dir"      : "/tmp",
    "fileName" : "batatinha.db4",
    "data"     : "batatinha batatosa fagundes"
});

socket.emit('load', "/tmp/batatinha.db4");

//socket.emit('get-markdown', 'teste.md');
//
//socket.on('get-markdown-resp', (data) => {
//    alert(data);
//});

socket.on('load_res', (data) => {
    alert("i receive "+data);
});

//end tests

pages[1] = `
<div id="lateral-bar">
    <button onclick="onLateralTabClick(0)"><span class="actor_icon"></span>Actors</button>
    <button onclick="onLateralTabClick(1)"><span class="project_icon"></span>Project</button>
    <button onclick="onLateralTabClick(2)"><span class="project_icon"></span>Docs</button>
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
</div>
`

pages[2] = `
<div id="lateral-bar">
    <button onclick="onLateralTabClick(0)"><span class="actor_icon"></span>Actors</button>
    <button onclick="onLateralTabClick(1)"><span class="project_icon"></span>Project</button>
    <button onclick="onLateralTabClick(2)"><span class="project_icon"></span>Docs</button>
</div>
<div class="form" id="doc">
    <h2 id="welcometothedocs">Welcome to the docs!</h2>
    <p>For learn, and get some examples, check beside.</p>
    <p><img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" alt="Alt Text" /></p>
</div>
<div class="second-form" id="doc-tree">
    <div class="item-field"><span>Page 1</span><button onclick="loadDoc('page1.md')"><span class="icon icon_edit"></span></button></div>
    <div class="item-field"><span>Page 2</span><button onclick="loadDoc('page2.md')"><span class="icon icon_edit"></span></button></div>
    <div class="item-field"><span>Page 3</span><button onclick="loadDoc('page3.md')"><span class="icon icon_edit"></span></button></div>
</div>
`

function newActorHTML(actor, n) {
    let tab = document.createElement("BUTTON");
    tab.setAttribute("onclick", "onEditorTabClick("+n+")");
    tab.innerHTML = actor.name;

    let button = document.createElement("div");
    button.setAttribute("class", "item-field");
    button.innerHTML = '<span>'+actor.name+'</span><button onclick="editActor('+n+
    ')"><span class="icon icon_edit"></span></button> <button onclick="eraseActor('+n+')"><span class="icon icon_erase"></span></button>';

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
    if (actors.length == 1) {
        actors[0].editing = true;
        editor.setValue(actors[0].content, -1);
        onEditorTabClick(0);
    }
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
        editor.setTheme("ace/theme/chrome");
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
    doc.innerHTML = "<span>Alias: "+sprite.alias+"</span><span>Path: "+sprite.path+"</span> <button onclick='editSprite("+n+")'><span class='icon icon_edit'></span></button> <button onclick='eraseSprite("+n+")'><span class='icon icon_erase'></span></button>";
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
                sprites[i].editing = false;
            }
        }
        document.getElementById("edit-media").innerHTML = "";
    }


let songs = new Array();

function newSongHTML(song, n) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<span>Alias: "+song.alias+"</span><span>Path: "+song.path+"</span> <button onclick='editSong("+n+")'><span class='icon icon_edit'></span></button> <button onclick='eraseSong("+n+")'><span class='icon icon_erase'></span></button>";
    return doc.outerHTML;
}

function expandSongs() {
    let song_area = document.getElementById("songs");
    song_area.innerHTML = "";
    let len = songs.length;
    for (let i = 0; i < len; i++) {
        song_area.innerHTML += newSongHTML(songs[i], i);
    }
    document.getElementById("songs-field").innerHTML =
    '<span>Songs</span> <button onclick="addSong()">+</button> <button id="hide-button" onclick="hideSongs()">^</button>';
}

function eraseSong(n) {
    songs.splice(n, 1);
    expandSongs();
}

function addSong() {
    songs[songs.length] = {
        "alias"   : "to edit",
        "path"    : "/tmp/",
        "editing" : false,
    };
    expandSongs();
}

function hideSongs() {
    document.getElementById("songs").innerHTML = "";
    document.getElementById("songs-field").innerHTML =
    '<span>Songs</span> <button onclick="addSong()">+</button> <button id="expand-button" onclick="expandSongs()">V</button>';
}

function editSong(n) {
    let len = songs.length;
    for (let i = 0; i < len; i++) {
        if (songs[i].editing) {
            songs[i].editing = false;
        }
    }
    songs[n].editing = true;
    document.getElementById("edit-media").innerHTML = `
    <div id="edit-media-form" style="display: flex; flex-direction: column;">
        <label>Alias:</label> <input id="alias-field" type="text">
        <label>Path:</label>  <input id="path-field" type="text">
    </div>
    <div id="edit-media-submit" style="display: flex; flex-direction: row;">
        <button onclick="saveSong()">Save</button> <button onclick="cancelSong()">Cancel</button>
    </div>`;
    document.getElementById("alias-field").value = songs[n].alias;
    document.getElementById("path-field").value  = songs[n].path;
}

    function saveSong() {
        let len = songs.length;
        for (let i = 0; i < len; i++) {
            if (songs[i].editing) {
                songs[i].alias = document.getElementById("alias-field").value;
                songs[i].path  = document.getElementById("path-field").value;
                expandSongs();
            }
        }
    }

    function cancelSong() {
        let len = songs.length;
        for (let i = 0; i < len; i++) {
            if (songs[i].editing) {
                songs[i].editing = false;
            }
        }
        document.getElementById("edit-media").innerHTML = "";
    }

let inputs = new Array();

function newInputHTML(input, n) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    doc.innerHTML = "<span>Alias: "+input.alias+"</span><span>Value: "+input.value+"</span> <button onclick='editInput("+n+")'><span class='icon icon_edit'></span></button> <button onclick='eraseInput("+n+")'><span class='icon icon_erase'></span></button>";
    return doc.outerHTML;
}

function expandInputs() {
    let input_area = document.getElementById("inputs");
    input_area.innerHTML = "";
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
        input_area.innerHTML += newInputHTML(inputs[i], i);
    }
    document.getElementById("inputs-field").innerHTML =
    '<span>Inputs</span> <button onclick="addInput()">+</button> <button id="hide-button" onclick="hideInputs()">^</button>';
}

function eraseInput(n) {
    inputs.splice(n, 1);
    expandInputs();
}

function addInput() {
    inputs[inputs.length] = {
        "alias"   : "to edit",
        "value"   : 0,
        "editing" : false,
    };
    expandInputs();
}

function hideInputs() {
    document.getElementById("inputs").innerHTML = "";
    document.getElementById("inputs-field").innerHTML =
    '<span>Inputs</span> <button onclick="addInput()">+</button> <button id="expand-button" onclick="expandInputs()">V</button>';
}

function editInput(n) {
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
        if (inputs[i].editing) {
            inputs[i].editing = false;
        }
    }
    inputs[n].editing = true;
    document.getElementById("edit-media").innerHTML = `
    <div id="edit-media-form" style="display: flex; flex-direction: column;">
        <label>Alias:</label> <input id="alias-field" type="text">
        <label>Path:</label>  <input id="value-field" type="text">
    </div>
    <div id="edit-media-submit" style="display: flex; flex-direction: row;">
        <button onclick="saveInput()">Save</button> <button onclick="cancelInput()">Cancel</button>
    </div>`;
    document.getElementById("alias-field").value = inputs[n].alias;
    document.getElementById("value-field").value = inputs[n].value;
}

    function saveInput() {
        let len = inputs.length;
        for (let i = 0; i < len; i++) {
            if (inputs[i].editing) {
                inputs[i].alias = document.getElementById("alias-field").value;
                inputs[i].value = document.getElementById("value-field").value;
                expandInputs();
            }
        }
    }

    function cancelInput() {
        let len = inputs.length;
        for (let i = 0; i < len; i++) {
            if (inputs[i].editing) {
                inputs[i].editing = false;
            }
        }
        document.getElementById("edit-media").innerHTML = "";
    }
    
/*
 * 
 */
function loadDoc(name) {
    socket.emit('get-markdown', name);

    socket.on('get-markdown-resp', (data) => {
        document.getElementById("doc").innerHTML = data;
    });
}

/*
 * Project management
 */

function exportProject() {
    let actorsQnt = actors.length;
    for (let i = 0; i < actorsQnt; i++) {
        socket.emit('export', {
            "dir"      : "/home/ifaresi/luagame/actors",
            "fileName" : actors[i].name+".lua",
            "data"     : actors[i].content,
        });
    }

    let project = "media = { ";
    let spritesQnt = sprites.length;
    for (let i = 0; i < spritesQnt; i++) {
        project += `
    {
        type  = "sprite",
        path  = "`+sprites[i].path+`",
        alias = "`+sprites[i].alias+`",
    },
`;
    }

    let songsQnt = songs.length;
    for (let i = 0; i < songsQnt; i++) {
        project += `
    {
        type  = "song",
        path  = "`+songs[i].path+`",
        alias = "`+songs[i].alias+`",
    },
`;
    }

    let inputsQnt  = inputs.length;
    for (let i = 0; i < inputsQnt; i++) {
        project +=`
    {
        type  = "input",
        value = `+inputs[i].value+`,
        alias = "`+inputs[i].alias+`",
    },
`;
    }
    project += "}";

    socket.emit('export', {
        "dir"      : "/home/ifaresi/luagame/",
        "fileName" : "project.lua",
        "data"     :  project,
    });

    alert("The project was exported");
}
