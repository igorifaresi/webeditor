function newItemForm(texts, buttons) {
    let doc = document.createElement("div");
    doc.setAttribute("class", "item-field");
    let len = texts.length;
    for (let i = 0; i < len; i++) {
        doc.innerHTML += '<span>'+texts[i].title+': '+texts[i].content+'</span>';
    }
    len = buttons.length;
    for (let i = 0; i < len; i++) {
        doc.innerHTML += '<button onclick="'+buttons[i].onclick+'"><span class=\'icon '+buttons[i].iconClass+'\'></span></button>'
    }
    return doc.outerHTML;
}

function fillArea(areaName, fun, array) {
    let area = document.getElementById(areaName);
    area.innerHTML = "";
    let len = array.length;
    for (let i = 0; i < len; i++) {
        area.innerHTML += fun(array[i], i);
    }
}

function editItem(groupName, areaName, array, data, types, n) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (array[i].editing) {
            array[i].editing = false;
        }
    }
    array[n].editing = true;
    let doc = document.getElementById(areaName); 
    doc.innerHTML = '<div id="edit-media-form" style="display: flex; flex-direction: column;">';
    len = data.length;
    for (let i = 0; i < len; i++) {
        if (types[i] == 'string') {
            doc.innerHTML += '<label>'+data[i]+':</label> <input id="'+data[i]+'-field" type="text">'
        } else if (types[i] == 'local-media-reference-img') {
            doc.innerHTML += '<input type="file" id="'+data[i]+'-field" accept=".bmp,.png,.jpg" />';
        } else if (types[i] == 'local-media-reference-song') {
            doc.innerHTML += '<input type="file" id="'+data[i]+'-field" accept=".mp3,.ogg,.flac,.wav" />';
        }
    }
    doc.innerHTML += `
    </div>
    <div id="edit-media-submit" style="display: flex; flex-direction: row;">
        <button onclick="`+groupName+`.save()">Save</button> <button onclick="`+groupName+`.cancel()">Cancel</button>
    </div>`;
    for (let i = 0; i < len; i++) {
        if (types[i] == 'string') {
            document.getElementById(data[i]+"-field").value = array[n][data[i]];
        }
    }
}

function saveEditing(array, data, types, socket) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (array[i].editing) {
            let dataFieldsLen = data.length;
            for (let j = 0; j < dataFieldsLen; j++) {
                if (types[j] == 'string') {
                    array[i][data[j]] = document.getElementById(data[j]+"-field").value;
                } else if (types[j] == 'local-media-reference-img' 
                ||         types[j] == 'local-media-reference-song') {
                    var file = document.getElementById(data[j]+"-field").files[0];
                    array[i][data[j]] = file.name;

                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            //window.open(e.target.result, '_blank')
                            socket.emit('store-media', {
                                "fileName" : file.name,
                                "data"     : e.target.result,
                            });
                        };
                    })(file);
                    reader.readAsDataURL(file);
                }
            }
        }
    }
}

function cancelEditing(editAreaName, array) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (array[i].editing) {
            array[i].editing = false;
        }
    }
    document.getElementById(editAreaName).innerHTML = "";
}