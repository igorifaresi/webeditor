const templateFile = `start = function()
	
end


loop = function()
	
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


var socket = io('http://localhost:8000/');

socket.emit('start', {});
socket.on('start-resp', (data) => {
    let ismain = true;
    let names = data[0];
    let scripts = data[1];
    for (let i = 0; i < scripts.length; i++) {
        if (ismain) {
            addActor(names[i], scripts[i], true)
            ismain = false;
        } else {
            addActor(names[i], scripts[i], false)
        }
    }
});

//addActor("batata");

// main pages -----------------------------------------------------------------

pages[1] = `
<div id="lateral-bar">
    <button onclick="onLateralTabClick(0)"><span class="actor_icon"></span>Actors</button>
    <button onclick="onLateralTabClick(1)"><span class="project_icon"></span>Project</button>
    <button onclick="onLateralTabClick(2)"><span class="doc_icon"></span>Docs</button>
</div>
<div class="form" id="media">
    <div id="sprites-field" class="item-field-major">
        <span>Sprites</span> <button onclick="sprites.addItem()"><span class="icon icon_add"></span></button> <button id="expand-button" onclick="sprites.expand()"><span class="icon icon_expand"></span></button>
    </div>
    <div id="sprites"></div>
    <div id="songs-field" class="item-field-major">
        <span>Songs</span> <button onclick="songs.addItem()"><span class="icon icon_add"></span></button> <button id="expand-button" onclick="songs.expand()"><span class="icon icon_expand"></span></button>
    </div>
    <div id="songs"></div>
    <div id="inputs-field" class="item-field-major">
        <span>Inputs</span> <button onclick="inputs.addItem()"><span class="icon icon_add"></span></button> <button id="expand-button" onclick="inputs.expand()"><span class="icon icon_expand"></span></button>
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
    <button onclick="onLateralTabClick(2)"><span class="doc_icon"></span>Docs</button>
</div>
<div class="form" id="doc">
    <h2 id="welcometothedocs">Welcome to the docs!</h2>
    <p>For learn, and get some examples, check beside.</p>
    <p><img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" alt="Alt Text" /></p>
</div>
<div class="second-form" id="doc-tree">
    <div class="item-field"><span>Manual rápido 1</span><button onclick="loadDoc('page1.md')"><span class="icon icon_show"></span></button></div>
    <div class="item-field"><span>Instruções para o Hackathon</span><button onclick="loadDoc('page2.md')"><span class="icon icon_show"></span></button></div>
</div>
`


// actors behaviour -----------------------------------------------------------

function newActorHTML(actor, n, ismain) {
    let tab = document.createElement("BUTTON");
    tab.setAttribute("onclick", "onEditorTabClick("+n+")");
    tab.innerHTML = actor.name;

    let button = document.createElement("div");
    button.setAttribute("class", "item-field");
    button.innerHTML = '<span>'+actor.name+'</span><button onclick="editActor('+n+
    ')"><span class="icon icon_edit"></span></button>';
    if (!ismain) {
        button.innerHTML += '<button onclick="eraseActor('+n+')"><span class="icon icon_erase"></span></button>';
    }

    if (!actor.editing) {
        tab.setAttribute("id", "tab-inactive");
    } else {
        tab.setAttribute("id", "tab-active");
    }

    return { "tab" : tab.outerHTML, "button" : button.outerHTML };
}

function justAddActor() {
    addActor(document.getElementById('actor-name-field-input').value, null, false);
    document.getElementById('actor-name-field-input').value = "";
}

function addActor(name, content, ismain) {
    let txt = ""
    if (content == null) {
        txt = "-- actor: "+name+"\n"+templateFile;
    } else {
        txt = content;
    }
    actors[actors.length] = {
        "name"    : name,
        "content" : txt,
        "editing" : false,
        "ismain"  : ismain,
    };
    let tmp = newActorHTML(actors[actors.length - 1], actors.length - 1, ismain);
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
        let tmp = newActorHTML(actors[i], i, actors[i].ismain);
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

class ProjectItemGroup {
    constructor(info) {
        this.array             = new Array();
        this.group             = info.group;
        this.title             = info.title;
        this.fields            = info.fields;
        this.fieldsTypes       = info.fieldsTypes;
        this.htmlItensField    = info.htmlItensField;
        this.htmlGroupHeader   = info.htmlGroupHeader;
        this.htmlEditItemField = info.htmlEditItemField;
        this._defaultItem      = info.defaultItem;
        this.newItemHTML       = info.newItemHTML;
    }
    expand() {
        fillArea(this.htmlItensField, this.newItemHTML, this.array);
        document.getElementById(this.htmlGroupHeader).innerHTML =
        '<span>'+this.title+'</span> <button onclick="'+this.group+'.addItem()"><span class="icon icon_add"></span></button>'+
        '<button id="hide-button" onclick="'+this.group+'.hide()"><span class="icon icon_hide"></span></button>'           ;
    }
    hide() {
        document.getElementById(this.htmlItensField).innerHTML = "";
        document.getElementById(this.htmlGroupHeader).innerHTML =
        '<span>'+this.title+'</span> <button onclick="'+this.group+'.addItem()"><span class="icon icon_add"></span></button>'+
        '<button id="expand-button" onclick="'+this.group+'.expand()"><span class="icon icon_expand"></span></button>'         ;
    }
    erase(n) {
        this.array.splice(n, 1);
        this.expand();
    }
    addItem() {
        let tmp = this._defaultItem;
        tmp.editing = false;
        this.array[this.array.length] = Object.assign({}, tmp);
        this.expand();
    }
    edit(n) {
        editItem(this.group, this.htmlEditItemField, this.array, this.fields, this.fieldsTypes, n);
    }
    save() {
        saveEditing(this.array, this.fields, this.fieldsTypes, socket);
        this.expand();
    }
    cancel() {
        cancelEditing(this.htmlEditItemField, this.array);
    }
};

let sprites = new ProjectItemGroup({
    group: "sprites", 
    title: "Sprites", 
    fields: ["alias", "file"],
    fieldsTypes: ["string", "local-media-reference-img"],
    htmlItensField: "sprites",
    htmlGroupHeader: "sprites-field",
    htmlEditItemField: "edit-media",
    defaultItem: {
        alias : "to edit",
        file  : "/tmp/",
    },
    newItemHTML: (item, n) => {
        return newItemForm(
            [{title: 'Alias', content: item.alias}, {title: 'File', content: item.file}],
            [{onclick: 'sprites.edit('+n+')' , iconClass: 'icon_edit' }, 
             {onclick: 'sprites.erase('+n+')', iconClass: 'icon_erase'}]
        );
    }
});

let songs = new ProjectItemGroup({
    group: "songs", 
    title: "Songs", 
    fields: ["alias", "file"],
    fieldsTypes: ["string", "local-media-reference-song"],
    htmlItensField: "songs",
    htmlGroupHeader: "songs-field",
    htmlEditItemField: "edit-media",
    defaultItem: {
        alias : "to edit",
        file  : "/tmp/",
    },
    newItemHTML: (item, n) => {
        return newItemForm(
            [{title: 'Alias', content: item.alias}, {title: 'File', content: item.file}],
            [{onclick: 'songs.edit('+n+')' , iconClass: 'icon_edit' }, 
             {onclick: 'songs.erase('+n+')', iconClass: 'icon_erase'}]
        );
    }
});

let inputs = new ProjectItemGroup({
    group: "inputs", 
    title: "Inputs", 
    fields: ["alias", "key"],
    fieldsTypes: ["string", "string"],
    htmlItensField: "inputs",
    htmlGroupHeader: "inputs-field",
    htmlEditItemField: "edit-media",
    defaultItem: {
        alias : "to edit",
        key   : "space",
    },
    newItemHTML: (item, n) => {
        return newItemForm(
            [{title: 'Alias', content: item.alias}, {title: 'Key', content: item.key}],
            [{onclick: 'inputs.edit('+n+')' , iconClass: 'icon_edit' }, 
             {onclick: 'inputs.erase('+n+')', iconClass: 'icon_erase'}]
        );
    }
});
    
// documentation management ---------------------------------------------------

function loadDoc(name) {
    socket.emit('get-markdown', name);

    socket.on('get-markdown-resp', (data) => {
        document.getElementById("doc").innerHTML = data;
    });
}


// project management ---------------------------------------------------------

function exportProject() {
    let actorsQnt = actors.length;
    let buffer = "";
    for (let i = 0; i < actorsQnt; i++) {
        if (actors[i].editing) {
            actors[i].content = editor.getValue();
        }
        socket.emit('store-actor', {
            "fileName" : actors[i].name+".lua",
            "script"   : actors[i].content,
        });
        if (i < actorsQnt - 1) {
            buffer += actors[i].name+"\n";
        } else {
            buffer += actors[i].name;
        }
    }
    socket.emit('store-actor-list', buffer);

    alert("The project was saved");
}
