import Server from './src/server.mjs'
import ServerRequest from './src/server_request.mjs'
import * as http from 'http';


let server = new Server();

http.createServer(function (req, res) {
    return new ServerRequest(server, req, res)
}).listen(8080);


process.on('beforeExit',  async function(code){
    await server.finalize();
});

process.on('exit',  async function(code){
    console.log("Exited with code "+code)
});
