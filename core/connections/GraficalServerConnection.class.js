const Client = require('ssh2').Client;
const fs = require("fs");
const rfb = require("rfb2");
const png = require("node-png");
const Log = require('../Log.class');
const electronLocalshortcut = require('electron-localshortcut');

class GraficalServerConnection {

    /**
     * The constructor of the GraficalServerConnection class
     * It will save all parameters into class attributes
     * 
     * @param  {String} ipAddress the host of the remote system
     * @param  {number} port the port on which the ssh server listens
     * @param  {String} password The password of the user that was specified above via the user name
     */
    constructor(ipAddress, port, password) {
        this.ip = ipAddress;
        this.port = port;
        this.password = password;
    }

    /**
     * Establishs the Connection to the remote system
     * @param  {function} readyCallback will be called when the connection is ready for operations
     * @param  {function} errorCallback will be called when an error is happening
     */
    connect(readyCallback, errorCallback) {
        let connectOpt = { host: this.ip, port: this.port, password: this.password};
        this.rfbConnection = rfb.createConnection(connectOpt);
        this.rfbConnection.on('connect', readyCallback(r.title, r.width, r.height));
        this.rfbConnection.on('error', (error) => errorCallback(error));
    }

    _decodeData(rect) {
        var rgb = new Buffer(rect.width * rect.height * 3, 'binary'), offset = 0;
        for (var i = 0; i < rect.data.length; i += 4) {
            rgb[offset++] = rect.data[i + 2];
            rgb[offset++] = rect.data[i + 1];
            rgb[offset++] = rect.data[i];
        }
        return new png(rgb, this.rfbConnection.width, this.rfbConnection.height, 'rgb').encodeSync();
    }

    updateRecived(imageCallback) {
        this.rfbConnection.on('rect', (rect) => this._decodeData(rect));
    }

    _listenForKeys() {
        electronLocalshortcut.register(mainWindow, 'F12', () => {
            // Open DevTools
        });
    }


    /**
     * Closes the ssh connection
     */
    close() {
        this.rfbConnection.end();
    }

    /**
     * returns the previously entered password
     */
    credentialsPassword() {
        return this.password;
    }

    /**
     * returns the previously entered server host
     */
    serverAdress() {
        return this.ip;
    }

    /**
     * returns the previously entered port of the ssh server
     */
    serverPort() {
        return this.port;
    }

  };


  module.exports = GraficalServerConnection;