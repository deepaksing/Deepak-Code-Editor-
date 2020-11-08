const {ipcRenderer} = require("electron");

let path = "";

ipcRenderer.on("filedata", (even, data) => {
    document.getElementById("editor").value = data.data;
    path = data.path;
});