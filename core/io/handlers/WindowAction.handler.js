"use strict";

const FilelyCore = require('../../FilelyCore.class');

const process = require('process');

class Test {

    getChannel() {
        return "window-action";
    }

    async handle(socket, msg) {
        this.window = FilelyCore.getElectronApp().getWindow();

        switch(msg) {
            case "minimize":
                this.window.minimize();
                break;
            case "maximize":
                this.window.maximize();
                break;
            case "restore":
                this.window.unmaximize();
                break;
            case "close":
                this.window.close();
                process.exit(0);
                break;
        }
    }

}


module.exports = Test;
