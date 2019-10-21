"use strict";

const connection = require("./../handlers/Connection.handler")

class ServerConnectionIPC {

    getChannel() {
        return "execute";
    }

    getCurrentConnection() {
        return this.connection;
    }

    async handle(socket, msg, event) {
        connection.getCurrentConnection().execute(msg, (data) => {
            event.reply(data);
        }, (data) => {
            event.reply(data);
        }, (data) => {
            event.reply(data);
        });
    }

}


module.exports = ServerConnectionIPC;
