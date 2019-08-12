var Client = require('ssh2').Client;
var ssh = null;

module.exports = class SSHClient {

    constructor(ip, port, user, password) {
        this.ip = ip;
        this.port = port;
        this.user = user;
        this.password = password;
        this.ready = false;
        ssh = this;
    }

    connect() {
        this.client = new Client();

        this.client.on('ready', function() {
            console.log('Client :: ready');
            ssh.serverReady();
        }).on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
            console.log('Connection :: keyboard-interactive');
            finish([ssh.credentialsPassword()]);
          }).connect({
            host: ssh.serverAdress(),
            port: ssh.serverPort(),
            username: ssh.credentialsUser(),
            password: ssh.credentialsPassword(),
            tryKeyboard:true
        });
    }

    execute(string) {
        if(this.serverIsReady()) {
            this.client.shell(function(err, stream) {
                if (err) throw err;
                stream.on('close', function() {
                    console.log('Stream :: close');
                }).on('data', function(data) {
                    console.log('OUTPUT: ' + data);
                });
                stream.end(string);
            });
        }else{
            console.log("client not ready");
        }
    }

    close() {
        this.client.end();
    }

    credentialsUser() {
        return this.user;
    }

    credentialsPassword() {
        return this.password;
    }

    serverAdress() {
        return this.ip;
    }

    serverPort() {
        return this.port;
    }

    serverReady() {
        this.ready = true;
    }

    serverIsReady() {
        return this.ready;
    }

  };