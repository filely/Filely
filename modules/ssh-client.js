var Client = require('ssh2').Client;

module.exports = class SSHClient {

    /**
     * The constructor of the SSHClient class
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
        this.client.on('error', () => console.log('SSH - Connection Error: ' + err));

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
     * @returns {Object} a Object that contains the following keys {error, result, code, signal}
     */
    execute(commands) {
        let result = "";
        let resultCode = 0;
        let resultSignal = null;
        let error  = "";
        await this.client.exec('uptime', function(err, stream) {
            if (err) throw err;
            stream.on('close', (code, signal) => {resultCode = code; resultSignal = signal})
            .on('data', (data) => result = data)
            .stderr.on('data', (data) => error = data);
        });
        return {error: error, result: result, code: resultCode, signal: signal};
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