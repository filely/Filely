"use strict";

const IPC = require('./io/IPC.class');
const ElectronApp = require('./desktop/ElectronApp.class');
const DiscordRPC = require('./desktop/DiscordRPC.class');
const log = require('./Log.class');

/**
 * Class providing main functions and classes
 */
class FilelyCore {

    /**
     * Starts the Filely app.
     * @returns {Promise<void>}
     */
    async run() {
        let start = new Date();

        log.info("Starting Filely App");

        this.app = new ElectronApp(); // TODO: Set argument to false to use in production

        this.ipc = new IPC(this.app);
        await this.ipc.loadHandlers();
        this.ipc.initHandlers();

        this.drpc = new DiscordRPC();
        this.drpc.run();

        this.app.run();

        let time = Math.floor((new Date().getTime() - start.getTime()) / 10) / 100;

        log.info("Successfully loaded in " + time + " s");
    }

}

let core = new FilelyCore();

module.exports = core;
