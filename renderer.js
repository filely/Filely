// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Client = require('./modules/ssh-client');

document.querySelector('#connectToServer').addEventListener('click', () => {
    let sshclient = new Client('xxx.xxx.xxx.xxx', 22, 'xxxxxx', 'xxxxxxx');
    sshclient.connect();
    setTimeout(() => { sshclient.execute("ls -l") }, 1000);
    setTimeout(() => { sshclient.close() }, 5000);
});