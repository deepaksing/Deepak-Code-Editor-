const os = require("os");
const fs = require("fs-extra");
const { dialog } = require("electron");

class FileManager {
  constructor(app_window) {
    const { homedir, username } = os.userInfo();
    this.homedir = homedir;
    this.username = username;
    this.historyPath = this.homedir + "/.config/history/info.json";
    this.app_window = app_window;
  }

  saveHistory(path) {
    // set directory for saving file path history
    fs.ensureFile(this.historyPath, (err) => {
      if (err) {
        throw err;
      }

      // read history json file
      fs.readJson(this.historyPath, { throws: false }).then((r) => {
        if (r === null) {
          const obj = {
            paths: [path],
          };
          // write path to json file
          fs.writeFile(this.historyPath, JSON.stringify(obj));
        } else {
          let isExist = r.paths.includes(path);
          if (!isExist) {
            r.paths.push(path);
            // write path to json file
            fs.writeFile(this.historyPath, JSON.stringify(r));
          }
        }
      });
    });
  }

  readHistory() {
    return fs
      .readJson(this.historyPath, { throws: false })
      .then((res) => {
        if (res == null) {
          console.log(null);
        } else {
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openFileWindow() {
    // Open dialog for selecting files from syetem
    dialog
      .showOpenDialog(this.app_window, { properties: ["openFile"] })
      .then((res) => {
        // If files are selected and opened means window not closed
        if (!res.canceled) {
          fs.readFile(res.filePaths[0], "utf-8", (err, data) => {
            // save file path in history
            this.saveHistory(res.filePaths[0]);
            // Fire an event from main process to renderer process with file data and path
            this.app_window.webContents.send("filedata", {
              data: data,
              path: res.filePaths[0],
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openRecentFile(path) {
    fs.readFile(path, "utf-8", (err, data) => {
      //save file path to history
      this.saveHistory(path);
      this.app_window.webContents.send("filedata", { data: data, path: path });
    });
  }
}

module.exports = {
  FileManager,
};