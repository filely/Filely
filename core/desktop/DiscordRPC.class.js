"use strict";

const {app, BrowserWindow, ipcMain} = require('electron');
const drpc = require('discord-rpc');
const Log = require('../Log.class');

/**
 * Class wrapping the electron BrowserWindow
 */
class DiscordRPC {

    constructor(clientId = '609820548108910592') {
        this.clientId = clientId;
        this._startRPC();
    }

    _startRPC() {
        this.rpc = new drpc.Client({ transport: 'ipc' });
        this.startTimestamp = new Date();
    }

    /**
     * Returns the IPC internal class.
     * @returns {Electron.ipcMain}
     */
    getRPC() {
        return this.rpc;
    }

    setActivity(refToThis) {
        let startDate = this.startTimestamp;
        this.rpc.setActivity({
            details: 'SSH & SFTP Client',
            state: 'Connected to a server',
            startDate,
            largeImageKey: 'logo',
            largeImageText: 'Filely - SSH & SFTP CLient',
            smallImageKey: 'logo',
            smallImageText: 'https://filely.app',
            instance: false,
        });
    }

    /**
     * Runs the electron app and opens the window.
     */
    run() {
        let that = this;
        let clientId = this.clientId;
        
        this.rpc.on('ready', () => {
            that.setActivity();
            setInterval(() => {
                that.setActivity();
            }, 15e3);
        });
        this.rpc.login({ clientId }).catch(console.error);
    }

}

module.exports = DiscordRPC;
