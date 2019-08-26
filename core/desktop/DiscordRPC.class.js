"use strict";

const drpc = require('discord-rpc');

/**
 * Class for handeling the Discord Rich Precence update scheduling
 */
class DiscordRPC {


    /**
     * 
     * Creates a new Instance of DiscordRPC
     * 
     * @param {String} clientId - default 609820548108910592 for the filely app
     */
    constructor(clientId = '609820548108910592') {
        this.clientId = clientId;
        this._startRPC();
    }


    /**
     * Starts the connection to Discord
     */
    _startRPC() {
        this.rpc = new drpc.Client({ transport: 'ipc' });
        this.startTimestamp = new Date();
    }

    /**
     * Returns the RPC internal class.
     * @returns {DiscordRPC.rpc}
     */
    getRPC() {
        return this.rpc;
    }

    /**
     * 
     * Sets the current rpc to the user
     * This methode will be called every 15 seconds
     */
    setActivity() {
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
     * Runs the update loop for the current activity 
     * Adds Filely to current playing game!
     */
    run() {
        let that = this;
        let clientId = this.clientId;
        //Hook for the ready event from discord
        this.rpc.on('ready', () => {
            that.setActivity();
            setInterval(() => {
                that.setActivity();
            }, 15e3);
        });
        //Does the login
        this.rpc.login({ clientId }).catch(console.error);
    }

}

module.exports = DiscordRPC;
