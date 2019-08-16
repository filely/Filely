"use strict";

/**
 * Class for logging into the console
 */
class Log {

    constructor() {
        this.debugMode = true;
    }

    /**
     * Sends a info message.
     * @param msg The message
     */
    info(msg) {
        console.log('\x1b[32m[INFO ' + this.getDateTime() + '] \x1b[37m' + msg);
    }

    /**
     * Sends a debug message.
     * @param msg The message
     */
    debug(msg) {
        if(this.debugMode) {
            console.log('\x1b[36m[DEBUG ' + this.getDateTime() + '] \x1b[37m' + msg);
        }
    }

    /**
     * Sends a warning message.
     * @param msg The message
     */
    warning(msg) {
        console.log('\x1b[33m[WARNING ' + this.getDateTime() + '] \x1b[37m' + msg);
    }

    /**
     * Sends a error message.
     * @param msg The message
     */
    error(msg) {
        console.log('\x1b[31m[ERROR ' + this.getDateTime() + '] \x1b[37m' + msg);
    }

    getDateTime() {
        const date = new Date();

        let hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        let sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        return hour + ":" + min + ":" + sec;
    }

}

module.exports = new Log();
