const { app, BrowserWindow, Menu, dialog} = require('electron')
const fs = require('fs');

let win;

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: "Ctrl+N",
        click() {
          NewFile();
        }
      },
      {
        label: "Save File",
        accelerator: "Ctrl+S",
        click: async() => {
          await win.webContents.send("saveFile");
        }
      },
      {
        label: "open file",
        accelerator: "Ctrl+O",
        click() {
          OpenFile();
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    x:100,
    y:100,
    minHeight: 400,
    minWidth:400,
    frame: false,
    backgroundColor: '#1E1E1E',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  })

  // win.loadFile("index.html")
  win.loadURL(`file://${__dirname}/index.html`);
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


const OpenFile = async() => {
  const files = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  const fc = fs.readFileSync(files['filePaths'][0]).toString();
  const fp = files['filePaths'][0];
  win.webContents.send("file", {fc, fp});
}
