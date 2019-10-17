const Client = require('ssh2').Client;
const fs = require("fs");
const Log = require('../Log.class');

class ServerConnection {

    /**
     * The constructor of the ServerConnection class
     * It will save all parameters into class attributes
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
     * Establishs the Connection to the remote system
     * @param  {function} readyCallback we be called when the connection is ready operations
     */
    connect(readyCallback, errCb) {
        //Creates an new ssh2 client
        this.client = new Client();

        //Listens for any kind of data (data and error)
        this.client.on('error', (err) => {Log.error('SSH - Connection Error: ' + err), errCb(err)});

        //Listens for the end and the start of an connection
        this.client.on('end', () => Log.info('SSH - Connection Closed'));
        this.client.on('ready', readyCallback);

        //If the ssh server requerst you to interact with the keyboard to enter the passwird it will do this here!
        this.client.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
            Log.debug('Connection :: keyboard-interactive');
            finish([ssh.credentialsPassword()]);
        });

        //Here we will declare a object with all the connection Options specified in the constructor in the class
        let connectOpt = { host: this.ip, port: this.port, username: this.user, password: this.password, tryKeyboard: true };
        return this.client.connect(connectOpt);
    }


    /**
     * 
     * Executes a command on the remote system. the result will be returned in form of a object
     * 
     * @param {String} commands The command that will be executed on the remote system
     * @param {function(data)} dataCallback the callback will be executed when the client recives the informations from the remote system
     * @param {function(stderr} errorCallback the callback will be executed when a error is happening
     * @param {function(code, signal)} closeCallback the callback will be executed when the current operation has finished
     */
    execute(commands, dataCallback, errorCallback, closeCallback) {
        //Handels the possibility if someone just wants to execute something with ignoring the result
        dataCallback  = dataCallback  || function(error) {};
        errorCallback = errorCallback || function(error) {};
        closeCallback = closeCallback || function(code, signal) {};

        //Executes the command on the remote system and calls the callbacks when something happesn
        this.client.exec(commands, function(err, stream) {
            if (err) errorCallback(err);
            stream.on('close', (code, signal) => closeCallback(code, signal))
            .on('data', (data) => dataCallback(String(data)))
            .stderr.on('data', (stderr) => errorCallback(stderr));
        });
    }

    /**
     * 
     * Recieves the directory listing of the remote system
     * 
     * @param {String} path The path from where the directory listing should be recieved
     * @param {function(list)} resultCallback If the listing was succsesfully created this callback will be executed
     * @param {function(error)} errorCallback if something wrong happens this will be executed
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
     * Loads a File from a remote system to your local system!
     * 
     * @param {String} remotePath The path to the File on the remote server.
     * @param {String} localPath The path where the file should be saved.
     * @param {function(localPath)} downloadSuccessCallback when the server has send all data to the client it can be saved there!
     * @param {function(error)} errorCallback if something wrong happens this will be executed
     */
    downloadFile(remotePath, localPath, downloadSuccessCallback, errorCallback) {
        //Opens a new SFTP Session
        this.client.sftp(function(err, sftp) {
            if (err) errorCallback(err);
            //Gets the data from the remote system and writes it to the local system
            sftp.fastGet(remotePath, localPath, (err) => {
                if (err) errorCallback(err);
                //calls the callback if everything goes right!
                downloadSuccessCallback(localPath);
              });
        });
    }

    /**
     * 
     * Loads a File from the local system to the remote system!
     * 
     * @param {String} localPath The path to the File on the remote server.
     * @param {String} remotePath The path where the file should be saved.
     * @param {function(remotePath)} uploadSuccessCallback when the server has recived all data the data the client has sended!
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