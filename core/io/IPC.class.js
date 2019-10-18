"use strict";

const fs = require('fs');
const {promisify} = require('util');
const readdir = promisify(fs.readdir);
const Log = require('../Log.class');

/**
 * Class for IPC to communicate with the frontend
 */
class IPC {

    constructor(electron) {
        this._handlers = {};
        this.ipc = electron.getIPC();
    }

    /**
     * Loads the message handlers from the handlers directory
     * @returns {Promise<void>}
     */
    async loadHandlers() {
        Log.info("Loading IPC handlers");
        let items = await readdir(`${__dirname}/handlers`);

        items.forEach((item) => {
            let LoadedHandler = require(`${__dirname}/handlers/${item}`);
            let handler = new LoadedHandler();

            this._handlers[handler.getChannel()] = (socket, msg, event) => handler.handle(socket, msg, event);
            Log.debug("Loaded IPC handler for \"" + handler.getChannel() + "\"");
        });
    }

    /**
     * Initializes the handlers to listen to messages from IPC.
     */
    initHandlers() {
        for(let channel in this._handlers) {
            this.ipc.on(channel, (event, arg) => {
                this._handlers[channel](this.ipc, arg, event);
            });
        }
    }

}

module.exports = IPC;
