"use strict";

/**
 * Class representing a message handler to extend from
 */
class MessageHandler {

    getChannel() {
        return "default";
    }

    async handle(socket, msg) {
        log.debug("Empty handle");
    }

}


module.exports = MessageHandler;
