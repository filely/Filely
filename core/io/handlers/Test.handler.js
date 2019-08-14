"use strict";

const Log = require('../../Log.class');

class Test {

    getChannel() {
        return "test";
    }

    async handle(socket, msg) {
        Log.debug("Test message: " + msg);
    }

}


module.exports = Test;
