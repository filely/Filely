// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Connection = require('./modules/connection');

document.querySelector('#connectToServer').addEventListener('click', () => {
    let conn = new Connection('192.168.157.128', 22, 'pi', 'root');
    conn.connect();
    setTimeout(() => {
        conn.execute("date", (data) => console.log(data))
        conn.listFileSystem("/usr/share/rpd-wallpaper", (data) => console.dir(data))
    }, 2000);
    setTimeout(() => { conn.close() }, 5000);
});