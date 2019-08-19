"use strict";

const {app, BrowserWindow, ipcMain} = require('electron');
const Log = require('../Log.class');
const path = require('path');
const net = require('net');

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
            height: 720,
            webPreferences: { nodeIntegration: true },
            icon: 'assets/icons/windows.ico'
        });
        this.mainWindow.setMenu(null);

        if (this.development === true) {
            Log.debug("Enabling development mode");

            this.mainWindow.webContents.openDevTools();

            let server = net.createServer();

            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    Log.debug("Using local Angular development server");
                    this.mainWindow.loadURL("http://localhost:4200");
                }
                server.close();
            });

            server.once('listening', () => {
                Log.debug("Using built files");
                this.mainWindow.loadFile(path.resolve(__dirname + "/../../public/dist/public/index.html"));
                server.close();
            });

            server.listen(4200);
        } else {
            console.log(path.resolve(__dirname + "/../../public/dist/public/index.html"));
            this.mainWindow.loadFile("public/dist/public/index.html");
        }

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
