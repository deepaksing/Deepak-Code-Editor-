const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');


let fps;


ipcRenderer.on("file", (event, {fc, fp}) => {
    document.getElementById("code").value = fc;
    fps = fp;
})


const svfile = () => {
    const sus = document.getElementById("code").value;
    console.log(sus);
    console.log(fps);
    fs.writeFileSync(fps, sus, 'utf-8');
    
}

ipcRenderer.on("saveFile",  async(event) => {
    await svfile();
})