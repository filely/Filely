"use strict";

const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const Log = require("../Log.class");
const path = require("path");
const net = require("net");

/**
 * Class wrapping the electron BrowserWindow
 */
class ElectronApp {

    constructor(development = true) {
        Log.debug(development);
        this.development = development;
        this.mainWindow = null;
    }


    /**
     * Creating the Native OS Window with Electron
     */
    _createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1280,
            height: 750,
            minHeight: 740,
            minWidth: 1170,
            webPreferences: { nodeIntegration: true },
            frame: false,
            icon: "assets/icons/windows.ico"
        });
        this.mainWindow.setMenu(null);

        //DEV Modus
        //Local Angular Server is in use!
        if (this.development === true) {
            Log.debug("Enabling development mode");

            //Opens the Chrome DevTools for better Debugging
            this.mainWindow.webContents.openDevTools();

            let server = net.createServer();

            server.once("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    Log.debug("Using local Angular development server");
                    this.mainWindow.loadURL("http://localhost:4200");
                }
                server.close();
            });

            //Local server isen't available, using build file 
            server.once("listening", () => {
                Log.debug("Using built files");
                this.mainWindow.loadFile(path.resolve(__dirname + "/../../public/dist/public/index.html"));
                server.close();
            });

            server.listen(4200, "localhost");
        } else {
            //Production Use, Loading builded files
            this.mainWindow.loadFile("public/dist/public/index.html");
        }

        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
    }

    /**
     * Returns the IPC internal class.
     * @returns {Electron.ipcMain}
     */
    getIPC() {
        return ipcMain;
    }

    /**
     * Returns the browser window
     * @returns {Electron.BrowserWindow}
     */
    getWindow() {
        return this.mainWindow;
    }

    /**
     * Mainly needed for the grafical server connection class
     * @param {function(data)} mouseMoveCallback will be called when the mouse is moving
     * 
     */
    hookMouse(mouseMoveCallback) {
        this.gsc = setInterval(() => mouseMoveCallback(electron.screen.getCursorScreenPoint()), 10);
        //Will be needed later! setTimeout(() => { this.unhookMouse() }, 20000);
    }

    unhookMouse() {
        clearInterval(this.gsc);
    }

    /**
     * Runs the electron app and opens the window.
     */
    run() {
        app.on("ready", this._createWindow.bind(this));
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
        app.setAsDefaultProtocolClient("ssh");
        app.setAsDefaultProtocolClient("sftp");
        app.setAsDefaultProtocolClient("ftp");
        app.setAsDefaultProtocolClient("rdp");
        app.setAsDefaultProtocolClient("vnc");
        if (this.mainWindow === null) {
            this._createWindow();
        }
    }

}

module.exports = ElectronApp;
