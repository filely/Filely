"use strict";

const {app, BrowserWindow, ipcMain} = require('electron');
const Log = require('../Log.class');

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
        this.mainWindow = new BrowserWindow({width: 1280, height: 720, webPreferences: {nodeIntegration: true}});
        this.mainWindow.setMenu(null);

        if (this.development === true) {
            Log.debug("Enabling development mode");
            this.mainWindow.loadURL("http://localhost:4200");
        } else {
            this.mainWindow.loadFile("public/dist/public/index.html");
        }

        this.mainWindow.webContents.openDevTools();

        this.mainWindow.on('closed', () => {
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
     * Runs the electron app and opens the window.
     */
    run() {
        app.on('ready', this._createWindow.bind(this));
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        if (this.mainWindow === null) {
            this._createWindow();
        }
    }

}

module.exports = ElectronApp;
