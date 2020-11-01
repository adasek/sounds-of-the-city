export default class ServerRequest {

    constructor(server, req, res) {
        this.server = server;

        res.setHeader('Content-Type', 'application/json');
        var _this = this

        if (req.method == 'POST') {
            var body = '';

            req.on('data', function (data) {
                body += data;

                if (body.length > 1e6) {
                    req.destroy();
                }
            });

            req.on('end', function () {
                let resultObject = _this.parseRequest(JSON.parse(body));
                if (!('error' in resultObject)) {
                    resultObject['status'] = "ok";
                } else {
                    resultObject['status'] = "error";
                }
                res.end(JSON.stringify(resultObject));
                req.destroy();
            });
        } else if (req.method == "HEAD") {
            // Preflight request
            res.end();
            req.destroy();
        } else {
            res.end(JSON.stringify({"error": "bad http method"}));
            req.destroy();
        }
    }

    parseRequest(requestBody) {
        var lat, lon;
        if (!('longitude' in requestBody) || isNaN(lon = parseFloat(requestBody['longitude']))) {
            return {'error': 'Parameter longitude missing/unparsable'}
        }
        if (!('latitude' in requestBody) || isNaN(lat = parseFloat(requestBody['latitude']))) {
            return {'error': 'Parameter latitude missing/unparsable'}
        }

        let result = {}
        return result
    }

};
