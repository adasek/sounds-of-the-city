import Server from './src/server.mjs'
import ServerRequest from './src/server_request.mjs'
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

let server = new Server();

http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Headers", "*");

    return new ServerRequest(server, req, res)
}).listen(process.env.PORT || 8090);


process.on('beforeExit', async function (code) {
    await server.finalize();
});

process.on('exit', async function (code) {
    console.log("Exited with code " + code)
});
