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

            req.on('end', async function () {
                let resultObject = await _this.parseRequest(JSON.parse(body));
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

    async parseRequest(requestBody) {
        var lat, lon, distance;
        if (!('longitude' in requestBody) || isNaN(lon = parseFloat(requestBody['longitude']))) {
            return {'error': 'Parameter longitude missing/unparsable'}
        }
        if (!('latitude' in requestBody) || isNaN(lat = parseFloat(requestBody['latitude']))) {
            return {'error': 'Parameter latitude missing/unparsable'}
        }
        if('distance' in requestBody){
            // distance in meters
            distance = parseInt(requestBody['distance']);
        }

        return this.getFeaturesAround(lat, lon, distance)
    }

    async getFeaturesAround(lat, lon, distance = 100){
    let queryString = `
     WITH 
leftTopCorner(p) as (SELECT ST_Project('POINT(${lon} ${lat})'::geography::geometry, sqrt(${distance}*2), radians(315.0))::geometry as p), 
rightBottomCorner(p) as  (SELECT ST_Project('POINT(${lon} ${lat})'::geography::geometry, sqrt(${distance}*2), radians(45.0))::geometry as p)
SELECT ctvuk_kod, ctvuk_popis, ST_AsText(ST_UNION(wkb_geometry) AS geometry)
 FROM technicke_vyuziti
 WHERE  wkb_geometry 
     && 
     ST_MakeEnvelope (
         (SELECT ST_X((select p from leftTopCorner))),
         (SELECT ST_Y((select p from leftTopCorner))),
         (SELECT ST_X((select p from rightBottomCorner))),
         (SELECT ST_Y((select p from rightBottomCorner)))
         )
     group by ctvuk_kod,ctvuk_popis
     `;
    let result = await this.server.query(queryString);
    return {'technical_usages': result.rows}
    }
};
