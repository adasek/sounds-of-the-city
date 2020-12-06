import Server from './src/server.mjs'
import ServerRequest from './src/server_request.mjs'
import * as http from 'http';
import * as dotenv from 'dotenv';

import serveHandler from 'serve-handler'

dotenv.config();

let server = new Server();

http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if(req.method.toLowerCase() == 'get'){
        return serveHandler(req, res, {
            public: 'public',
            directoryListing: false
        });
    }else{
        return new ServerRequest(server, req, res)
    }
}).listen(process.env.PORT || 8090);


process.on('beforeExit', async function (code) {
    await server.finalize();
});

process.on('exit', async function (code) {
    console.log("Exited with code " + code)
});
