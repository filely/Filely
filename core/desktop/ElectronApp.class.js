"use strict";

const {app, BrowserWindow, ipcMain} = require("electron");
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

    _createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1280,
            height: 900,
            minHeight: 680,
            minWidth: 1170,
            webPreferences: { nodeIntegration: true },
            frame: false,
            icon: "assets/icons/windows.ico"
        });
        this.mainWindow.setMenu(null);

        if (this.development === true) {
            Log.debug("Enabling development mode");

            this.mainWindow.webContents.openDevTools();

            let server = net.createServer();

            server.once("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    Log.debug("Using local Angular development server");
                    this.mainWindow.loadURL("http://localhost:4200");
                }
                server.close();
            });

            server.once("listening", () => {
                Log.debug("Using built files");
                this.mainWindow.loadFile(path.resolve(__dirname + "/../../public/dist/public/index.html"));
                server.close();
            });

            server.listen(4200, "localhost");
        } else {
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
