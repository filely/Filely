var Client = require('ssh2').Client;

module.exports = class ServerConnection {

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
     */
    connect() {
        //Creates an new ssh2 client
        this.client = new Client();

        //Listens for any kind of data (data and error)
        this.client.on('data', (data) => console.log('OUTPUT: ' + data));
        this.client.on('error', (err) => console.log('SSH - Connection Error: ' + err));

        //Listens for the end and the start of an connection
        this.client.on('end', () => console.log('SSH - Connection Closed'));
        this.client.on('ready', () => console.log('SSH - Client ready'));

        //If the ssh server requerst you to interact with the keyboard to enter the passwird it will do this here!
        this.client.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
            console.log('Connection :: keyboard-interactive');
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
     * @param {function} errorCallback if something wrong happens this will be executed
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