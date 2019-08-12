// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ssh = require('./modules/ssh-client');

document.querySelector('#connectToServer').addEventListener('click', () => {
    console.log(ssh);
    let sshclient = new ssh('127.0.0.1', 22, 'xxxxx', 'xxxxx');
    sshclient.connect();
    setTimeout(function() {
        sshclient.execute("dir");
        sshclient.close();
    }, 2000); 
});