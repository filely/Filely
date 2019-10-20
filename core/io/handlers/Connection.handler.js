"use strict";

const Log = require('../../Log.class');
const FilelyCore = require('../../FilelyCore.class');
const ServerConnection = require("../../connections/ServerConnection.class")

class ServerConnectionIPC {

    getChannel() {
        return "connect";
    }

    getCurrentConnection() {
        return this.connection;
    }

    async handle(socket, msg, event) {
            switch(msg.authType) {
                case "pw":
                    this.connection = new ServerConnection(msg.ip, msg.port, msg.connectOptions.user, msg.connectOptions.password);
                    this.connection.connect(()=>{
                        event.reply('connect-reply', {successfully: true, error: "None"});
                    },
                    (err) => {
                        event.reply('connect-reply', {successfully: false, error: err});
                    });
                    break;
                case "key":
                    
                    break;
                case "u2f":
                    
                    break;
            }
        }

}


module.exports = ServerConnectionIPC;
