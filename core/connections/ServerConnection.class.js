const Client = require('ssh2').Client;
const fs = require("fs");
const Log = require('../Log.class');

class ServerConnection {

    /**
     * The constructor of the ServerConnection class
     * 
     * @param  {String} ipAddress the host of the remote system
     * @param  {number} port the port on which the ssh server listens
     * @param  {String} user The username of the user on the remote system
     * @param  {String} password The password of the user that was specified above via the user name
     */
    constructor(ipAddress, port, user, password) {
        this.ip = ipAddress;
        this.port = port;
        this.user = user;
        this.password = password;
    }

    /**
     * Establish the Connection to the remote system
     * @param  {function} readyCallback callBack when the connection is ready for usage
     */
    connect(readyCallback, errCb) {
        //Creates an new ssh2 client
        this.client = new Client();

        //Listens for any kind of data (data and error)
        this.client.on('error', (err) => {Log.error('SSH - Connection Error: ' + err), errCb(err)});

        //Listens for the end and the start of the connection
        this.client.on('end', () => Log.info('SSH - Connection Closed'));
        this.client.on('ready', readyCallback);

        //If the server is configured to take keyboard interactions, it will be handeld here!
        this.client.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
            Log.debug('Connection :: keyboard-interactive');
            finish([ssh.credentialsPassword()]);
        });

        //Creates a Object with all connection options
        let connectOpt = { host: this.ip, port: this.port, username: this.user, password: this.password, tryKeyboard: true };
        return this.client.connect(connectOpt);
    }


    /**
     * 
     * Executes a command on the remote system. the result will be returned in form of an object
     * 
     * @param {String} commands The command that will be executed on the remote system
     * @param {function(data)} dataCallback callback will be executed when the client receives informations from the remote system
     * @param {function(stderr} errorCallback callback will be executed when a error has occurred
     * @param {function(code, signal)} closeCallback callback will be executed when the current operation has finished
     */
    execute(commands, dataCallback, errorCallback, closeCallback) {
        dataCallback  = dataCallback  || function(error) {};
        errorCallback = errorCallback || function(error) {};
        closeCallback = closeCallback || function(code, signal) {};

        //Executes the command on the remote system and executes the callbacks with the data
        this.client.exec(commands, function(err, stream) {
            if (err) errorCallback(err);
            stream.on('close', (code, signal) => closeCallback(code, signal))
            .on('data', (data) => dataCallback(String(data)))
            .stderr.on('data', (stderr) => errorCallback(stderr));
        });
    }

    /**
     * 
     * Receives the directory listing from the remote system
     * 
     * @param {String} path The path from where the directory listing should be received
     * @param {function(list)} resultCallback If the listing was succsesfully created this callback will be executed
     * @param {function(error)} errorCallback if something wrong happend this callback will be called
     */
    listFileSystem(path, resultCallback, errorCallback) {
        //Opens a new SFTP Session
        this.client.sftp(function(err, sftp) {
            if (err) errorCallback(err);
            //Reads the directory from the path specified as a parameter
            sftp.readdir(path, (err, list) => { resultCallback(list); if(err) errorCallback(err)} );
        });
    }

    
    /**
     * 
     * Transfers a File from the remote system to your local system!
     * 
     * @param {String} remotePath The path to the File on the remote server.
     * @param {String} localPath The path where the file should be saved.
     * @param {function(localPath)} downloadSuccessCallback when the server has finished sending all data to the client
     * @param {function(error)} errorCallback if something wrong happens, this will be executed
     */
    downloadFile(remotePath, localPath, downloadSuccessCallback, errorCallback) {
        //Opens a new SFTP Session
        this.client.sftp(function(err, sftp) {
            if (err) errorCallback(err);
            //Gets the data from the remote system and writes it to the local storage
            sftp.fastGet(remotePath, localPath, (err) => {
                if (err) errorCallback(err);
                //calls the callback if everything goes correct!
                downloadSuccessCallback(localPath);
              });
        });
    }

    /**
     * 
     * Transfers a File from your system to the remote system!
     * 
     * @param {String} localPath The path to the File on the remote server.
     * @param {String} remotePath The path from where the file should be used.
     * @param {function(remotePath)} uploadSuccessCallback when the server has recived all the data the client has sended!
     * @param {function(remotePath)} closeCallback the stream was closed and the operation has ended
     * @param {function(error)} errorCallback if something wrong happens this will be executed
     */
    uploadFile(localPath, remotePath, uploadSuccessCallback, closeCallback, errorCallback) {
        //Opens a new SFTP Session
        this.client.sftp(function(err, sftp) {
            if (err) errorCallback(err);

            // reads the file data
            var readStream = fs.createReadStream(localPath);

            //writes the data from the local fiel to the remote system
            var writeStream = sftp.createWriteStream(remotePath);
    
            writeStream.on('close',function () {
                uploadSuccessCallback(remotePath);
            });
            
            //The operation has ended and a new one can start!
            writeStream.on('end', function () {
                closeCallback(remotePath);
            });
    
            // moves the data from the local file stream to the remote file write stream!
            readStream.pipe( writeStream );

        });
    }

    /**
     * Closes the ssh connection
     */
    close() {
        this.client.end();
    }

    /**
     * returns the previously entered username
     */
    credentialsUser() {
        return this.user;
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


  module.exports = ServerConnection;